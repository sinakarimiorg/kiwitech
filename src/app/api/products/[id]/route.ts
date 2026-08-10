import { NextResponse } from "next/server"
import ProductModel from "@root/src/models/Product"
import { connectDB } from "@root/src/lib/mongodb"

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