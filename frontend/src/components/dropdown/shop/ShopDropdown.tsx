import { shopLinkslist } from '../datalink/data';
import ShopLinks from "./ShopLink";



export default function ShopDropdown() {

    return (
        <div className="grid gap-6 p-6 ">
            <ShopLinks links={shopLinkslist} title="Shop All" />
        </div>
    )
}