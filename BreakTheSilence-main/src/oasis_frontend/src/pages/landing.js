import React from 'react';
import Navbar from './components/landing/navbar';
import bled from '../assets/Red&Black img.svg';
import arrow from '../../src/assets/arrow.svg';
import ulta from '../../src/assets/ulta-ulta.svg'
import { Link } from 'react-router-dom';

const FaqCard = (props) => {
    return (
        <>
            <div className='bg-[#161618] text-xl rounded-lg text-white px-4 py-8 mt-8 relative flex justify-center items-center'>
                <div className='flex flex-col justify-start items-start w-full mt-2 gap-2'>
                    <div className='text-[#fe570b] text-xl'>
                        {props.title}
                    </div>
                    <div className='text-sm'>
                        {props.answer}
                    </div>
                </div>
                <div className='absolute -top-5'>
                    <button className='bg-[#161618] w-16 h-16 rounded-full'>
                        <button className='bg-[#fe570b] w-10 h-10 rounded-full'>
                            <button className='text-white w-7 h-7 rounded-full'>
                                {props.count}
                            </button>
                        </button>
                    </button>
                </div>
            </div>
        </>
    )
}

const LandingPage = () => {
    var FaqCardCount = 0;
    const getFaqCardCount = () => {
        FaqCardCount += 1;
        return FaqCardCount
    }
    return (
        <div>
            <div id="hero">
                <Navbar />
                <div className='grid lg:grid-cols-2 lg:h-[80dvh]'>
                    <div className='flex order-2 lg:order-1 flex-col items-center justify-center gap-3 lg:gap-6 m-16'>
                        <div className=' text-[#fe570b] text-2xl md:text-2xl lg:text-5xl leading-6 font-bold '>
                            <span className='text-white'>Break The Silence:</span> Speak Up. Be Heard
                        </div>
                        <div className='text-white flex flex-col gap-5 ml-1 lg:gap-10'>
                            <div className='text-base md:text-md lg:text-xl'>
                                Break The Silence is an innovative online platform that provides a safe space
                                for victims of abuse to raise their voices and seek justice.
                                Together, we are creating an oasis of support, where every voice matters,
                                every survivor is empowered, and the cycle of this silence is shattered.
                            </div>
                            <div className='flex items-center gap-8 lg:gap-5 '>
                                <Link to="/dashboard/abuse-form">
                                    <button className='text-white text-md lg:text-lg font-bold bg-[#fe570b] px-4 py-1 lg:px-6 lg:py-3 rounded-full'>
                                        File a report
                                    </button>
                                </Link>
                                <a href='#faq'>
                                    <button className='bg-[#0d0101] text-white text-md lg:text-lg border-[1.5px] px-4 py-1 lg:px-7 lg:py-3 rounded-full'>
                                        Learn more
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='mt-7 lg:h-[80dvh] order-1 lg:order-2 flex items-center justify-center'>
                        <img className='w-[90%] h-auto drop-shadow-glow' src={bled} />
                    </div>
                </div>
            </div>
            <div id='faq'>
                <div className='bg-[#161618] text-white mx-36 my-20 py-8 rounded-lg grid grid-cols-3'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='text-[#fe570b] text-6xl font-bold'>
                            42+
                        </div>
                        <div className='text-md font-semibold'>
                            Cases Undertaken
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='text-[#fe570b] text-6xl font-bold'>
                            32+
                        </div>
                        <div className='text-md font-semibold'>
                            Cases Resolved
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='text-[#fe570b] text-6xl font-bold'>
                            10+
                        </div>
                        <div className='text-md font-semibold'>
                            Cases Ongoing
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-col gap-3 text-4xl  text-[#fe570b] my-10 flex items-center justify-center '>
                <span className='font-semibold'>Know what's happening</span>
                <span className='text-white text-4xl'> BTS: Here's what's going on behind the scenes</span>
            </div>
            <div className='grid grid-cols-8 items-center justify-center mx-8'>
                <div className='flex col-span-2'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <button className='bg-[#fe570b] text-xl text-white font-semibold rounded-full w-16 h-16'>
                            1
                        </button>
                        <div className='text-md text-white font-semibold'>
                            <div className='flex flex-col gap-2 items-center justify-center'>
                                Report your abuse
                                <span className='text-base font-normal mb-10 px-10'>
                                    Your report is taken seriously and stored in blockchain, where data tampering is next to impossible.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <img className='h-auto w-24' src={arrow} />
                </div>
                <div className='flex col-span-2'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <button className='bg-[#fe570b] text-xl text-white font-semibold rounded-full w-16 h-16'>
                            2
                        </button>
                        <div className='text-md text-white font-semibold'>
                            <div className='flex flex-col gap-2 items-center justify-center'>
                                Case transfered to Police
                                <span className='text-base font-normal mb-10 px-14'>
                                    The data is further sent securely to the police, ensuring privacy and effective communication.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <img className='h-auto w-24' src={ulta} />
                </div>
                <div className='flex flex-col col-span-2 items-center justify-center gap-4'>
                    <button className='bg-[#fe570b] text-xl text-white font-semibold rounded-full w-16 h-16'>
                        3
                    </button>
                    <div className='text-md text-white font-semibold'>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            Action taken and Updated
                            <span className='text-base font-normal mb-10 px-12'>
                                Police investigate, take necessary actions, and you can track the status of the case in your profile.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-20'>
                <div className='text-5xl text-[#fe570b] flex flex-col gap-4 items-center justify-center my-6'>
                    FAQs
                    <div className='text-white text-2xl'>
                        Check out the most frequently asked questions to get a better idea of what you're getting into.
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='grid grid-cols-3 gap-9 gap-y-20 mx-20 my-8'>
                        <FaqCard title="What types of abuse does BreakTheSilence address?"
                            answer="Break The Silence addresses all forms of physical abuse, including domestic violence, assault, child abuse, and any other acts of physical harm or violence. We strive to create a safe space for survivors of various forms of physical abuse."
                            count={getFaqCardCount()} />
                        <FaqCard title="How can I report an incident of physical abuse?"
                            answer="To report an incident, simply navigate to the FILE A REPORT section on our platform and follow the guided steps. We provide a secure and confidential environment for you to share your experience."
                            count={getFaqCardCount()} />
                        <FaqCard title="Is my information safe and confidential?"
                            answer="We take your privacy and security seriously.We store all your information in blockchain thus ensures data integrity and prevents tampering, safeguarding sensitive details with encryption."
                            count={getFaqCardCount()} />
                        <FaqCard title="Do you accept anonymous incident reports?"
                            answer="To maintain the integrity of the reporting process and avoid false case reports, we require individuals to provide their identity while reporting an incident on BreakTheSilence. We prioritize the safety and well-being of all users and have implemented strict confidentiality measures to protect your information."
                            count={getFaqCardCount()} />
                        <FaqCard title="How can I contact BreakTheSilence for further assistance?"
                            answer="If you have any additional questions or need further assistance, please reach out to our support team through the contact information provided on our website. We are here to provide assistance and address any concerns you may have on your journey towards healing and justice."
                            count={getFaqCardCount()} />
                        <FaqCard title="What if I need immediate assistance or feel unsafe after submitting the report?"
                            answer="If you require immediate assistance or feel unsafe, we encourage you to contact your local police directly. It is essential to prioritize your safety. Please inform us so that we can offer any available resources or assistance to support you during this time."
                            count={getFaqCardCount()} />

                    </div>
                </div>
            </div>
            <div className="bg-[#161618] mt-24">
                <footer className="py-4 gap-2 mx-12 flex flex-col md:flex-row justify-between items-center px-4">
                    <div className="flex items-center flex-shrink-0 order-2 py">
                        <div>
                            <span className="text-[#a6aabb] text-sm font-medium pl-2">2023 ©
                                <span className="text-[#5c5e6d] cursor-pointer"> BreakTheSilence </span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 order-1 md:order-3">
                        <a href="#hero"><div className="cursor-pointer text-[#84889d] mr-4 text-sm ">
                            About
                        </div></a>
                        <Link to="/auth"><div className="cursor-pointer text-[#84889d] mr-4 text-sm">
                            Support
                        </div></Link>
                        <Link to="/dashboard/abuse-form"><div className="cursor-pointer text-[#84889d] mr-4 text-sm">
                            Contact Us
                        </div></Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default LandingPage;