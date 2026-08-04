import { NextResponse } from "next/server"
import ProductModel from "@root/src/models/Product"
import { connectDB } from "@root/src/lib/mongodb"
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
    try {
        await connectDB()
        const products = await ProductModel.find().sort({ createdAt: -1 })
        return NextResponse.json({ success: true, data: products })
    } catch (error) {
        return NextResponse.json({ success: false, error: "خطا در دریافت محصولات" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();
        const img = formData.get("img") as File | null;

        if (!img) {
            return NextResponse.json(
                { success: false, error: "تصویر محصول الزامی است" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await img.arrayBuffer());
        const filename = `${Date.now()}-${img.name.replace(/\s+/g, "-")}`;
        const imgPath = path.join(process.cwd(), "public/uploads", filename);

        await writeFile(imgPath, buffer);

        const exPriceInput = formData.get("exPrice");
        const descriptionInput = formData.get("description") as string | null;
        const tagsInput = formData.get("tags") as string | null;

        const productData = {
            name: formData.get("name"),
            linkName: formData.get("linkName"),
            price: Number(formData.get("price")),
            exPrice: exPriceInput ? Number(exPriceInput) : null,
            discount: Number(formData.get("discount")),
            stock: Number(formData.get("stock")),
            category: formData.get("category"),
            subCategory: formData.get("subCategory"),
            description: descriptionInput? descriptionInput : null,
            colors: formData.get("colors"),
            tags: tagsInput ? tagsInput.split(",").map(tag => tag.trim()) : [],
            img: `/uploads/${filename}`
        };

        const product = await ProductModel.create(productData);

        return NextResponse.json(
            { success: true, message: "محصول با موفقیت ثبت شد", data: product },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { success: false, error: "خطا در ثبت محصول" },
            { status: 500 }
        );
    }
}