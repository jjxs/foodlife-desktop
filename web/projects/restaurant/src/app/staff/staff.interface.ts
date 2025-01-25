import { MenuCategory } from "../menu/menu.interface";

export class CallingSeat {
    group: number;
    group_no: string;
    group_name: string;
    id: number;
    name: string;
    seat_no: string;
    count: number;
}

export class StaffMenu {

    price: number = 0;
    tax_in: boolean = false;
    is_free: boolean = false;
    id: number = 0;
    name: string = '';
    image: string = '';
    no: number = 0;
    count: number = 0;
    note: string = '';
    introduction: string = '';
    menu_options: Array<object>;

    constructor(data?: MenuCategory) {
        this.count = 0;
        this.is_free = false;
        if (data) {
            this.id = data.menu_id;
            this.no = data.menu_no;
            this.name = data.menu_name;
            this.price = data.menu_price;
            this.image = data.image;
        }
    }
} 