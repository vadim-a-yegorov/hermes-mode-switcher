# hermes-mode-switcher

Mode selector for the Hermes desktop app.  

Adds `Auto`, `Deep Research` mode and `Computer` mode.

![](Auto_Research_Computer.png "Auto | Research | Computer")

## Install

1. Clone into `~/.hermes/desktop-plugins/`:

   ```bash
   mkdir -p ~/.hermes/desktop-plugins
   cd ~/.hermes/desktop-plugins
   git clone https://github.com/vadim-a-yegorov/hermes-mode-switcher
   ```

2. Copy the personality files into `~/.hermes/personalities/`:

   ```bash
   mkdir -p ~/.hermes/personalities
   cp hermes-mode-switcher/personalities/research-deep.yaml ~/.hermes/personalities/
   cp hermes-mode-switcher/personalities/computer.yaml ~/.hermes/personalities/
   ```

3. Register personalities in `~/.hermes/config.yaml`:

   Edit `~/.hermes/config.yaml`:

   ```yaml
   agent:
     personalities:
       - research-deep
       - computer
   ```

   OR run:

   ```bash
   yq -i '.agent.personalities += ["research-deep", "computer"]' ~/.hermes/config.yaml
   ```

4. Create the four sub-agent profiles:

   ```bash
   mkdir -p ~/.hermes/profiles/{researcher,executor,operator,verifier}
   cp -r hermes-mode-switcher/profiles/* ~/.hermes/profiles/
   ```

5. Reload desktop plugins: `Cmd+K` → "Reload desktop plugins".

## Usage

Pick a mode in the composer toolbar:

- **Auto** — normal chat
- **Research** — prepends `[DEEP RESEARCH]`, runs cited multi-step research on send
- **Computer** — prepends `[OK-COMPUTER]`, dispatches parallel multi-worker orchestration
