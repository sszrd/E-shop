export interface IGood {
    id: number,
    name: string,
    price: number,
    typeId: number,
    subTypeId: number,
    icon: string,
    images: IImage[],
    colors: IColor[],
    count: number,
    tabShow: number
}

export interface IGoodResponse {
    id: number,
    name: string,
    price: number,
    typeId: number,
    subTypeId: number,
    icon: string,
    images: string,
    colors: string,
    count: number,
    tabShow: number
}

export interface IImage {
    index: number,
    src: string
}

export interface IColor {
    name: string,
    value: string
}

export interface ISubtype {
    id: number,
    typeName: string,
    typeId: number,
    grade: number,
    img: string
}

export interface IType {
    id: number,
    typeName: string,
    grade: number
}

export interface IComment {
    id: number,
    username: string,
    goodId: number,
    score: number,
    comment: string
}