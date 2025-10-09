export type User={
    id: number | null,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "user" | "admin"
}
export type Category={
    id: number | null,
    name: string,
    description: string,
    createdAt: string
}
export type Vocabulary={
    id: number | null,
    categoryId: number,
    word: string,
    meaning: string,
    isLearned: boolean
}
export type Result={
    id: number | null,
    userId: number,
    categoryId: number,
    score: number,
    total: number,
    date: string
}