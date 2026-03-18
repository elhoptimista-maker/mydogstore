# .idx/dev.nix actualizado para Arquitectura Senior
{pkgs}: {
  channel = "stable-24.11"; 
  
  packages = [
    pkgs.nodejs_22
    pkgs.zulu
    pkgs.firebase-tools
    pkgs.nodePackages.typescript-language-server
  ];

  env = {
    # Forzamos a Genkit a usar un modelo estable si el preview falla
    GOOGLE_GENAI_MODEL = "gemini-2.0-flash"; 
  };

  services.firebase.emulators = {
    detect = false;
    projectId = "demo-app";
    services = ["auth" "firestore"];
  };

  idx = {
    extensions = [
      "google.gemini-vscode" # Extensión oficial para asistencia de código
      "esbenp.prettier-vscode"
      "ms-vscode.vscode-typescript-next"
    ];
    workspace = {
      onCreate = {
        # Instalación automática de dependencias críticas
        install-deps = "npm install zod @genkit-ai/ai @genkit-ai/googleai framer-motion lucide-react";
        default.openFiles = [ "src/app/page.tsx" ];
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}