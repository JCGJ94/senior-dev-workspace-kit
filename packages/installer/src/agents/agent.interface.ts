export type SupportTier = 'full' | 'good' | 'partial' | 'minimal';

export interface DetectionResult {
  installed: boolean;
  version?: string;
  configExists: boolean;
  configPaths: string[];
}

export interface InstallContext {
  kitPath: string;
  targetPath: string;
}

export interface MCPServer {
  name: string;
  command: string;
  args?: string[];
}

export interface Skill {
  name: string;
  path: string;
}

export interface Persona {
  name: string;
  rules: string[];
}

export interface Theme {
  name: string;
}

export interface Permissions {
  allowedOps: string[];
}

export type GGAProvider = 'claude' | 'gemini' | 'ollama' | 'opencode';

export interface VerificationResult {
  success: boolean;
  errors: string[];
}

export type Capability =
  | 'engram'
  | 'mcp'
  | 'skills'
  | 'sdd'
  | 'persona'
  | 'theme'
  | 'permissions'
  | 'gga';

export interface Agent {
  // Identity
  name(): string;
  tier(): SupportTier;

  // Detection & installation
  detect(): Promise<DetectionResult>;
  install(ctx: InstallContext): Promise<void>;

  // Ecosystem configuration (throw ErrNotSupported if capability not applicable)
  configureEngram(): Promise<void>;
  configureMCP(servers: MCPServer[]): Promise<void>;
  configureSkills(skills: Skill[]): Promise<void>;
  configureSDD(): Promise<void>;
  configurePersona(persona: Persona): Promise<void>;
  configureTheme(theme: Theme): Promise<void>;
  configurePermissions(perms: Permissions): Promise<void>;
  configureGGA(provider: GGAProvider): Promise<void>;

  // Validation
  verify(): Promise<VerificationResult>;

  // Metadata
  configPaths(): string[];
  capabilities(): Capability[];
}
