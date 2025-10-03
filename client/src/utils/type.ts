export type User={
    id: number | null,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "user" | "admin"
}
export type Category={
    id: number,
    name: string,
    description: string,
    createdAt: string
}
export type Vocab={
    id: number,
    categoryId: number,
    word: string,
    meaning: string,
    isLearned: boolean
}
export type Result={
    id: number,
    userId: number,
    categoryId: number,
    score: number,
    total: number,
    date: string
}