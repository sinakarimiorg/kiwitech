"use client"
import { useRouter } from "next/navigation";
import styles from "./table.module.css";
import { useState } from "react";
// import swal from "sweetalert2";



function AddProduct() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [weight, setWeight] = useState("");
    const [suitableFor, setSuitableFor] = useState("");
    const [smell, setSmell] = useState("");
    const [tags, setTags] = useState("");
    const [img, setImg] = useState({});

    const addProduct = async () => {
        alert("در حال افزودن محصول ...");
    }

    return (
        <section className={styles.discount}>
            <p>افزودن محصول جدید</p>
            <div className={styles.discount_main}>
                <div>
                    <label>نام محصول</label>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="لطفا نام محصول را وارد کنید"
                        type="text"
                    />
                </div>
                <div>
                    <label>مبلغ محصول</label>
                    <input
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        placeholder="لطفا مبلغ محصول را وارد کنید"
                        type="text"
                    />
                </div>

                <div>
                    <label>توضیحات کوتاه</label>
                    <input
                        value={shortDescription}
                        onChange={(event) => setShortDescription(event.target.value)}
                        placeholder="توضیحات کوتاه محصول"
                        type="text"
                    />
                </div>

                <div>
                    <label>تگ های محصول</label>
                    <input
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                        placeholder="مثال: قهوه،قهوه ترک، قهوه اسپرسو"
                        type="text"
                    />
                </div>
                <div>
                    <label>تصویر محصول</label>
                    <input
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                setImg(file);
                            }
                        }}
                        type="file"
                    />
                </div>
            </div>
            <button onClick={addProduct}>افزودن</button>
        </section>
    )
}

export default AddProduct;