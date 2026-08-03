import { NextResponse } from "next/server"
import ProductModel from "@root/src/models/Product"
import { connectDB } from "@root/src/lib/mongodb"

export async function GET() {
    try {
        await connectDB()
        const products = await ProductModel.find().sort({ createdAt: -1 })
        return NextResponse.json({ success: true, data: products })
    } catch (error) {
        return NextResponse.json({ success: false, error: "خطا در دریافت محصولات" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await connectDB()
        const body = await request.json()
        const product = await ProductModel.create(body)
        return NextResponse.json({ success: true, data: product }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: "خطا در ثبت محصول" }, { status: 500 })
    }
}