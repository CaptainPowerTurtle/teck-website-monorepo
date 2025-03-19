import { canUseDOM } from "@repo/utils";
import { env } from "@/env";

export const getServerSideURL = () => {
  let url = env.NEXT_PUBLIC_SERVER_URL;

  if (!url && env.PROJECT_PRODUCTION_URL) {
    return `https://${env.PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  return url;
};

export const getClientSideURL = () => {
  if (canUseDOM()) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ""}`;
  }

  if (env.PROJECT_PRODUCTION_URL) {
    return `https://${env.PROJECT_PRODUCTION_URL}`;
  }

  return env.NEXT_PUBLIC_SERVER_URL || "";
};
