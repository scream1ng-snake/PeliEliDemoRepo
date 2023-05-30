export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'

export type FETCH_DATA = typeof FETCH_DATA_REQUEST | typeof FETCH_DATA_SUCCESS | typeof FETCH_DATA_FAILURE;

export type CourseItem = {
    VCode: number,
    Name: string,
    CatVCode: number,
    Discount_Price: number,
    Price: number,
}

export type CategoryCourse = {
    VCode: number,
    Name: string,
    MenuVCode: number,
    CourseList: CourseItem[],
}

export type MenuServerDataType = CategoryCourse[] | null | string;

export interface MenuDataLoadState {
    loading: boolean;
    data: MenuServerDataType;
    error: string;
}

interface SetMenuDataAction {
    type: FETCH_DATA;
    payload: MenuServerDataType;
}

export type MenuDataLoadActionTypes = SetMenuDataAction;