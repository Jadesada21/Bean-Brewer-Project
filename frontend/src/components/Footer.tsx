import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <footer className="bg-zinc-800 text-white px-70 pt-10 pb-5">

            {/* <!-- top --> */}
            <div className="flex justify-between">

                {/* <!-- left --> */}
                <div className="grid grid-cols-4 gap-30">

                    <div>
                        <h3 className="font-bold mb-4 text-xl">Shop</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1"><Link to="">Bean</Link></li>
                            <li className="pt-3 hover:underline decoration-1"><Link to="">Roast Level</Link></li>
                        </ul>
                    </div >

                    <div>
                        <h3 className="font-bold mb-4 text-xl">Reward</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1"><Link to="">Equipment</Link></li>
                        </ul>
                    </div >

                    <div>
                        <h3 className="font-bold mb-4 text-xl">Support</h3>
                        <ul className="space-y-2 text-xl ">
                            <li className="pt-3 hover:underline decoration-1"> <Link to="">Contact Us</Link></li>
                            <li className="pt-3 hover:underline decoration-1"><Link to="">About Us</Link></li>
                        </ul >
                    </div >

                </div >

                {/* <!-- right --> */}
                < div className="flex items-center justify-center w-150 mt-15" >
                    <h2 className="text-8xl font-bold">
                        BEAN
                    </h2>

                </div >

            </div >

            {/* <!-- bottom --> */}
            < div className="mt-16 text-xl text-gray-400 flex gap-6" >
                <span className="hover:underline decoration-1"><Link to="">Terms</Link></span>
                <span className="hover:underline decoration-1"><Link to="">Privacy</Link></span>
                <span className="hover:underline decoration-1"><Link to="">Cookies</Link></span>
            </div >
            < div className="mt-2 text-xl text-gray-400 flex gap-6" >
                <span>Copyright © Bean Inc. 2026 All Rights Reserved</span>
            </div >


        </footer >
    )
}
