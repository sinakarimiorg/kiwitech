import { NextResponse } from "next/server"
import ProductModel from "@root/src/models/Product"
import { connectDB } from "@root/src/lib/mongodb"
import { writeFile } from "fs/promises"
import path from "path"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const { id } = await params
        const deleted = await ProductModel.findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "محصول یافت نشد" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: true, message: "محصول با موفقیت حذف شد" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { success: false, error: "خطا در حذف محصول" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()
        const { id } = await params
        const formData = await req.formData()

        const newImageFiles = formData.getAll("newImages") as File[]
        const newSavedPaths: string[] = []

        for (let i = 0; i < newImageFiles.length; i++) {
            const img = newImageFiles[i]
            if (!img || typeof img === "string" || !img.size) continue
            const buffer = Buffer.from(await img.arrayBuffer())
            const filename = `${Date.now()}-${i}-${img.name.replace(/\s+/g, "-")}`
            const imgPath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(imgPath, buffer)
            newSavedPaths.push(`/uploads/${filename}`)
        }

        const existingImagesRaw = formData.get("existingImages") as string | null
        const existingImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : []

        const allImages = [...existingImages, ...newSavedPaths]

        if (!allImages.length) {
            return NextResponse.json(
                { success: false, error: "حداقل یک تصویر برای محصول لازم است" },
                { status: 400 }
            )
        }

        const exPriceInput = formData.get("exPrice")
        const descriptionInput = formData.get("description") as string | null
        const tagsInput = formData.get("tags") as string | null

        const updateData = {
            name: formData.get("name"),
            linkName: formData.get("linkName"),
            price: Number(formData.get("price")),
            exPrice: exPriceInput ? Number(exPriceInput) : null,
            discount: Number(formData.get("discount")) || 0,
            stock: Number(formData.get("stock")),
            category: formData.get("category"),
            subCategory: formData.get("subCategory"),
            description: descriptionInput ? descriptionInput : null,
            colors: formData.get("colors"),
            tags: tagsInput ? tagsInput.split(",").map(tag => tag.trim()).filter(Boolean) : [],
            img: allImages[0],
            images: allImages.slice(1),
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: "محصولی با این شناسه یافت نشد" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, message: "محصول با موفقیت ویرایش شد", data: updatedProduct },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error updating product:", error)
        return NextResponse.json(
            { success: false, error: "خطا در ویرایش محصول" },
            { status: 500 }
        )
    }
}