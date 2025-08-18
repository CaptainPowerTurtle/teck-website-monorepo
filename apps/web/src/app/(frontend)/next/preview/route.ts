import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { NextRequest } from "next/server";
import { getPayload, type PayloadRequest } from "payload";
import configPromise from "@payload-config";
import type { CollectionSlug } from "payload";


export async function GET(request: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const collection = searchParams.get("collection") as CollectionSlug;
  const slug = searchParams.get("slug");
  const previewSecret = searchParams.get("previewSecret");

  if (previewSecret) {
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  if (!path) {
    return new Response("No path provided", { status: 404 });
  }
  if (!collection) {
    return new Response("No path provided", { status: 404 });
  }
  if (!slug) {
    return new Response("No path provided", { status: 404 });
  }
  if (!path.startsWith("/")) {
    return new Response(
      "This endpoint can only be used for internal previews",
      { status: 500 }
    );
  }

  let user;
  try {
    user = await payload.auth({
      req: request as unknown as PayloadRequest,
      headers: request.headers,
    });
  } catch (error) {
    payload.logger.error(
      { err: error },
      "Error verifying token for live preview"
    );
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  const draft = await draftMode();
  if (!user) {
    draft.disable();
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  }

  // Verify the given slug exists
  try {
    const docs = await payload.find({
      collection,
      draft: true,
      limit: 1,
      pagination: false,
      depth: 0,
      select: {},
      where: {
        slug: {
          equals: slug,
        },
      },
    });
    if (!docs.docs.length) {
      return new Response("Document not found", { status: 404 });
    }
  } catch (error) {
    payload.logger.error(
      { err: error },
      "Error verifying token for live preview"
    );
  }

  draft.enable();
  redirect(path);
}
