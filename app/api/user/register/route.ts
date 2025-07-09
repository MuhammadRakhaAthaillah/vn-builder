
import { writeFile, readdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir } from "fs/promises";
import { unlink } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You are not authorized to access this resource", success: false },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("filePhoto") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      return NextResponse.json(
        { error: "File must be an image (png, jpg, jpeg)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik dengan timestamp
    const fileName = `profile.jpg`;
    
    const publicPath = path.join(process.cwd(), `public/uploads/users/${session.user.id}`);

    // Buat folder jika belum ada
    await mkdir(publicPath, { recursive: true });

    // try {
    //   const files = await readdir(publicPath);
    //   for (const file of files) {
    //     await unlink(path.join(publicPath, file));
    //   }
    // } catch (error) {
    //   console.log('No existing files to delete');
    // }

    const filePath = path.join(publicPath, fileName);

    // Tulis file baru
    await writeFile(filePath, buffer);

    // Gunakan path relatif untuk URL gambar
    const imageUrl = `/uploads/users/${session.user.id}/${fileName}`;

    await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        profile_picture: imageUrl
      }
    });

    // Tambahkan header untuk mencegah caching
    const response = NextResponse.json({
      success: true,
      message: "Success update profile image",
      data: {
        url: imageUrl
      }
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error("Error update profile image:", error);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
}