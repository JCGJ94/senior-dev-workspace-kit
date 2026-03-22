export type EngramObservationType =
  | 'decision'
  | 'bug'
  | 'pattern'
  | 'convention'
  | 'lesson';

export interface OpenCodeProject {
  name: string;
}

export interface OpenCodeObservation {
  sessionId?: string;
  project: string;
  type: EngramObservationType;
  topicKey: string;
  content: string;
  tags?: string[];
}

export interface OpenCodeSessionSummary {
  goal?: string;
  summary?: string;
  endedAt?: number;
}

export interface EngramSession {
  id: string;
  project: string;
  agent: string;
  started_at: number;
  ended_at?: number | null;
  goal?: string | null;
  summary?: string | null;
}

export interface EngramObservation {
  id: string;
  session_id?: string | null;
  project: string;
  type: EngramObservationType;
  topic_key: string;
  content: string;
  tags: string;
  created_at: number;
  updated_at: number;
}

export interface OpenCodeEngramPluginOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export class OpenCodeEngramPlugin {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: OpenCodeEngramPluginOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'http://127.0.0.1:7437';
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async onSessionStart(
    project: OpenCodeProject,
    goal?: string,
  ): Promise<{ session: EngramSession; context: EngramObservation[] }> {
    const session = await this.postJson<EngramSession>('/sessions', {
      project: project.name,
      agent: 'opencode',
      goal,
    });

    const context = await this.getJson<EngramObservation[]>(
      `/observations/context?project=${encodeURIComponent(project.name)}`,
    );

    return { session, context };
  }

  async onObservation(observation: OpenCodeObservation): Promise<EngramObservation> {
    return this.postJson<EngramObservation>('/observations', {
      session_id: observation.sessionId,
      project: observation.project,
      type: observation.type,
      topic_key: observation.topicKey,
      content: observation.content,
      tags: observation.tags ?? [],
    });
  }

  async onSessionEnd(sessionId: string, summary: OpenCodeSessionSummary): Promise<void> {
    await this.patchJson(`/sessions/${encodeURIComponent(sessionId)}`, {
      ended_at: summary.endedAt ?? Date.now(),
      goal: summary.goal,
      summary: summary.summary,
    });
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`);
    return this.readJson<T>(response, `GET ${path}`);
  }

  private async postJson<T>(path: string, body: unknown): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return this.readJson<T>(response, `POST ${path}`);
  }

  private async patchJson(path: string, body: unknown): Promise<void> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Engram request failed for PATCH ${path}: ${response.status} ${message}`);
    }
  }

  private async readJson<T>(response: Response, operation: string): Promise<T> {
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Engram request failed for ${operation}: ${response.status} ${message}`);
    }

    return (await response.json()) as T;
  }
}

export function createOpenCodeEngramPlugin(
  options?: OpenCodeEngramPluginOptions,
): OpenCodeEngramPlugin {
  return new OpenCodeEngramPlugin(options);
}
