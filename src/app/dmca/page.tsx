
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DMCA() {
    return (
        <main className="min-h-screen bg-prime-dark text-gray-300">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 space-y-8">
                <div className="space-y-4 border-b border-gray-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">DMCA Policy</h1>
                    <p className="text-lg text-gray-400">
                        Is Meowly Legal?
                    </p>
                </div>

                <section className="space-y-4">
                    <p>
                        Meowly operates in a legal gray area. Copyright laws vary significantly from country to country, and the legality of streaming services can be complex and subject to interpretation.
                    </p>
                    <p>
                        Meowly does not host any content on our servers. We simply provide links to media hosted on third-party services that are publicly available on the internet.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Copyright Information</h2>
                    <p>
                        Copyright laws vary by jurisdiction. In some countries, streaming content may be considered legal for personal use, while in others it may be prohibited.
                    </p>
                    <p>
                        Users should be aware of the copyright laws in their respective countries and use Meowly at their own discretion and risk.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">DMCA Takedown Requests</h2>
                    <p>
                        If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please submit a notification to our designated Copyright Agent at:
                    </p>
                    <div className="bg-prime-card p-4 rounded-lg border border-gray-800">
                        <span className="text-prime-blue font-bold">Email:</span> contact@meowtv.anonaddy.me
                    </div>

                    <p className="pt-4 font-bold text-white">Please include the following information in your notification:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-gray-400">
                        <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
                        <li>Identification of the copyrighted work claimed to have been infringed</li>
                        <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity</li>
                        <li>Your contact information, including your address, telephone number, and email address</li>
                        <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
                        <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
                    <p>
                        Meowflix is not responsible for and has no control over the content of any third-party website. We do not host any content and have no control over the nature, content, or availability of those sites.
                    </p>
                    <p>
                        The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.
                    </p>
                    <p>
                        This site does not store any files on our server, we only link to media which is hosted on 3rd party services.
                    </p>
                </section>
            </div>
        </main>
    );
}
