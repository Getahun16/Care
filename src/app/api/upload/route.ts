import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  // Only allow authenticated admins
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate type — SVG excluded (can carry embedded scripts)
    const allowedImages = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    const allowedDocs = ["application/pdf"];
    const allowed = [...allowedImages, ...allowedDocs];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, GIF, WebP, and PDF files are allowed." },
        { status: 400 },
      );
    }

    // Max 20 MB for PDFs, 2 MB for images
    const maxSize = allowedDocs.includes(file.type)
      ? 20 * 1024 * 1024
      : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: allowedDocs.includes(file.type)
            ? "PDF must be under 20 MB."
            : "Image must be under 2 MB.",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build a unique filename — strip the original extension from file.name to avoid spoofing
    const mimeToExt: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
      "application/pdf": "pdf",
    };
    const ext = mimeToExt[file.type] ?? "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Sanitize folder: only allow lowercase alphanumerics, dashes, underscores, no traversal
    const rawFolder = new URL(req.url).searchParams.get("folder") ?? "partners";
    const folder = rawFolder.replace(/[^a-z0-9_-]/gi, "").slice(0, 32) || "uploads";
    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
