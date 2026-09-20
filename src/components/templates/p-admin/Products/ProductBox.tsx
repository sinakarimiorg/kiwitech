import { PiPencilSimpleLight, PiTrashLight } from 'react-icons/pi'
import { AdminProduct } from "@root/src/types/adminProductType"

type ProductBoxProps = {
    product: AdminProduct
    onEdit: (product: AdminProduct) => void
    onDelete: (id: string) => void
}

function stockBadge(stock: number) {
    if (stock === 0) return { label: "ناموجود", className: "bg-danger/10 text-danger" }
    if (stock <= 3) return { label: `${stock} عدد`, className: "bg-amber-50 text-amber-600" }
    return { label: `${stock} عدد`, className: "bg-primary-50 text-primary-600" }
}

function ProductBox({ product, onDelete, onEdit }: ProductBoxProps) {
    const badge = stockBadge(product.stock)

    return (
        <>
            {/* ردیف جدول - از md به بالا */}
            <tr key={product._id} className='hidden md:table-row hover:bg-primary-50/30 transition-colors'>
                <td className='px-5 sm:px-6 py-3.5'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                            <img src={product.img} className='w-full h-full object-cover' alt={product.name} />
                        </div>
                        <p className='text-zinc-700 line-clamp-2 max-w-64'>{product.name}</p>
                    </div>
                </td>
                <td className='px-3 py-3.5 text-zinc-500'>{product.category}</td>
                <td className='px-3 py-3.5'>
                    <div className='flex flex-col'>
                        <span className='font-IranYekanMedium text-zinc-700'>{product.price.toLocaleString()} تومان</span>
                        {product.exPrice &&
                            <span className='text-xs text-zinc-400 line-through'>{product.exPrice.toLocaleString()}</span>
                        }
                    </div>
                </td>
                <td className='px-3 py-3.5'>
                    <span className={`px-2.5 py-1 text-xs rounded-lg ${badge.className}`}>{badge.label}</span>
                </td>
                <td className='px-3 py-3.5'>
                    <div className='flex items-center gap-2'>
                        <button
                            className='flex-center w-8 h-8 text-zinc-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer'
                            onClick={() => onEdit(product)}
                        >
                            <PiPencilSimpleLight className='w-4 h-4' />
                        </button>
                        <button
                            className='flex-center w-8 h-8 text-zinc-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer'
                            onClick={() => onDelete(product._id)}
                        >
                            <PiTrashLight className='w-4 h-4' />
                        </button>
                    </div>
                </td>
            </tr>

            {/* کارت - زیر md */}
            <tr className='md:hidden'>
                <td colSpan={5} className='p-0'>
                    <div className='flex gap-3 px-4 py-4 border-b border-gray-50'>
                        <div className='w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden'>
                            <img src={product.img} className='w-full h-full object-cover' alt={product.name} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm text-zinc-700 line-clamp-2'>{product.name}</p>
                            <p className='mt-1 text-xs text-zinc-400'>{product.category}</p>

                            <div className='flex items-center justify-between mt-2.5 gap-2'>
                                <div className='flex flex-col min-w-0'>
                                    <span className='font-IranYekanMedium text-sm text-zinc-700 truncate'>{product.price.toLocaleString()} تومان</span>
                                    {product.exPrice &&
                                        <span className='text-xs text-zinc-400 line-through'>{product.exPrice.toLocaleString()}</span>
                                    }
                                </div>
                                <span className={`px-2 py-1 text-[11px] rounded-lg shrink-0 ${badge.className}`}>{badge.label}</span>
                            </div>

                            <div className='flex items-center gap-2 mt-3'>
                                <button
                                    onClick={() => onEdit(product)}
                                    className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-primary-600 bg-primary-50 rounded-lg cursor-pointer'>
                                    <PiPencilSimpleLight className='w-3.5 h-3.5' />
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => onDelete(product._id)}
                                    className='flex-center gap-1.5 flex-1 py-1.5 text-xs text-danger bg-danger/10 rounded-lg cursor-pointer'>
                                    <PiTrashLight className='w-3.5 h-3.5' />
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}

export default ProductBox