import os
import json
import sys
from pathlib import Path

def main():
    print("Starting Skill Architecture Validation...")
    
    has_errors = False

    def report_error(msg):
        nonlocal has_errors
        print(f"ERROR: {msg}", file=sys.stderr)
        has_errors = True

    # Root directory is one level up from scripts/
    root_dir = Path(__file__).resolve().parent.parent
    manifest_path = root_dir / 'registry' / 'skill_manifest.json'
    preferred_skills_path = root_dir / 'registry' / 'preferred_skills.md'
    skills_dir = root_dir / 'skills'

    # 1. Load manifest
    if not manifest_path.exists():
        report_error(f"Manifest not found at {manifest_path}")
        sys.exit(1)

    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
    except Exception as e:
        report_error(f"Failed to parse JSON in {manifest_path}: {e}")
        sys.exit(1)

    skills_dict = manifest.get('skills', {})
    registered_skills = list(skills_dict.keys())

    # 2. Check registered skills
    for skill_name, skill_data in skills_dict.items():
        skill_path_rel = skill_data.get('path', '')
        
        # Check format
        if not (skill_path_rel.startswith('skills/') and skill_path_rel.endswith('/SKILL.md')):
            report_error(f"Skill '{skill_name}' path '{skill_path_rel}' does not match expected format 'skills/<name>/SKILL.md'")
            continue
        
        # Check existence
        abs_path = root_dir / skill_path_rel
        if not abs_path.exists():
            report_error(f"Skill file for '{skill_name}' declared in manifest does not exist at '{skill_path_rel}'")

    # 3. Check preferred_skills.md
    if preferred_skills_path.exists():
        try:
            with open(preferred_skills_path, 'r', encoding='utf-8') as f:
                for line in f:
                    # Look for lines starting with "- skill-name"
                    line = line.strip()
                    if line.startswith('- '):
                        skill_name_raw = line[2:].strip()
                        # Only validate if it's explicitly marked as a skill with backticks
                        if skill_name_raw.startswith('`') and skill_name_raw.endswith('`'):
                            skill_name = skill_name_raw[1:-1]
                            if skill_name and all(c.isalnum() or c == '-' for c in skill_name):
                                if skill_name not in registered_skills:
                                    report_error(f"'preferred_skills.md' references unregistered skill: '{skill_name}'")
        except Exception as e:
            report_error(f"Error reading {preferred_skills_path}: {e}")
    else:
        report_error(f"preferred_skills.md not found at {preferred_skills_path}")

    # 4 & 5. Audit the skills/ folder
    if skills_dir.exists():
        for entry in os.scandir(skills_dir):
            if entry.is_dir():
                # Every folder must contain SKILL.md
                skill_md_path = Path(entry.path) / 'SKILL.md'
                if not skill_md_path.exists():
                    report_error(f"Skill folder '{entry.name}' is missing SKILL.md")
            elif entry.is_file():
                # No flat files or legacy *_skill.md
                if entry.name.endswith('.md'):
                    report_error(f"Legacy flat file or invalid file found in skills directory: '{entry.name}'. Skills must be folders.")
    else:
        report_error(f"Skills directory not found at {skills_dir}")

    if has_errors:
        print("\nValidation FAILED. Please fix the above errors.", file=sys.stderr)
        sys.exit(1)
    else:
        print("All checks passed. The skill architecture is consistent and strictly compliant.")

if __name__ == "__main__":
    main()
