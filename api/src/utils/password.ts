import bcrypt from "bcrypt";
export const compare = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}

export const hash = (plainPassword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
}