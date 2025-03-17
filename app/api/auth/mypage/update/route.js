import { auth } from "@/auth";
import { connectToDB } from "../../../../../lib/mongoose";
import User from "../../../../../models/User";

export async function PATCH(req) {
    const session = await auth();
    if (!session || !session.user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, imgURL } = await req.json();
    
    await connectToDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 변경된 값이 있을 때만 업데이트
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (imgURL) user.imgURL = imgURL;

    await user.save();

    return Response.json({ message: "User updated successfully", user });
}
