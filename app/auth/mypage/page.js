"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyPage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        imgURL: ""
    });

    useEffect(() => {
        if (session) {
            fetch("/api/auth/mypage")
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    setFormData({
                        name: data.name || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        imgURL: data.imgURL || ""
                    });
                });
        }
    }, [session]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/mypage/update", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setUser(updatedUser.user);
            alert("정보가 업데이트되었습니다.");
        } else {
            alert("업데이트 실패!");
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>로그인이 필요합니다.</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold">마이페이지</h1>
            {user && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-gray-700">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">주소</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">프로필 이미지 URL</label>
                        <input
                            type="text"
                            name="imgURL"
                            value={formData.imgURL}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        업데이트
                    </button>
                </form>
            )}
        </div>
    );
}