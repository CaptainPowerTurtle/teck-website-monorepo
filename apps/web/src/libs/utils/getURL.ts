import { canUseDOM } from "@repo/utils";
import { env as server } from "@/env/server";
import { env as client } from "@/env/client";

export const getServerSideURL = () => {
  let url = client.NEXT_PUBLIC_SERVER_URL;

  if (!url && server.PROJECT_PRODUCTION_URL) {
    return `https://${server.PROJECT_PRODUCTION_URL}`;
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

  if (server.PROJECT_PRODUCTION_URL) {
    return `https://${server.PROJECT_PRODUCTION_URL}`;
  }

  return client.NEXT_PUBLIC_SERVER_URL || "";
};
