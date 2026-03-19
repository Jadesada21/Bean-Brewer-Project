import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <footer className="bg-zinc-800 text-white px-4 md:px-10 lg:px-20 pt-10 pb-5 font-baskerville">

            {/* <!-- top --> */}
            <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0">

                {/* <!-- left --> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full text-center">

                    <div className="text-gray-200">
                        <h3 className="font-bold mb-4 text-xl">Shop</h3>
                        <ul className="space-y-2 text-base sm:text-lg">

                            <li className="pt-1 hover:underline decoration-1">
                                <Link to="/shops">Bean</Link></li>

                        </ul>
                    </div>

                    <div className="text-gray-200">
                        <h3 className="font-bold mb-4 text-xl ">Reward</h3>
                        <ul className="space-y-2 text-base sm:text-lg ">

                            <li className="pt-1 hover:underline decoration-1">
                                <Link to="/rewards">Equipment</Link></li>
                        </ul>
                    </div>

                    <div className="text-gray-200">
                        <h3 className="font-bold mb-4 text-xl ">Support</h3>
                        <ul className="space-y-2 text-base sm:text-lg">

                            <li className="pt-1 hover:underline decoration-1">
                                <Link to="/contact-us">Contact Us</Link></li>

                            <li className="pt-1 hover:underline decoration-1">
                                <Link to="/about-us">About Us</Link></li>
                        </ul >
                    </div>

                </div>

                {/* <!-- right --> */}
                <div className="flex justify-center items-center w-full mt-15 " >
                    <h2 className="text-6xl sm:text-7xl font-bold text-gray-200 text-center">
                        BEAN
                    </h2>

                </div>

            </div>

            {/* <!-- bottom --> */}
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-start gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base text-center" >
                <Link to="/term" className="hover:underline decoration-1 ">Terms</Link>
                <Link to="/privacy" className="hover:underline decoration-1 ">Privacy</Link>
                <Link to="/cookies" className="hover:underline decoration-1 ">Cookies</Link>
            </div>

            <div className="mt-2 text-gray-400 text-sm sm:text-base text-center sm:text-left" >
                <span className="">Copyright © Bean Inc. 2026 All Rights Reserved</span>
            </div>

        </footer>
    )
}
