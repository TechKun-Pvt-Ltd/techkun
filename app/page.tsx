'use client'
import Banner from "@/app/sections/Banner";
import Cofounders from "@/app/sections/Cofounders";
import ContactUs from "@/app/sections/ContactUs";
import MeetTechKun from "@/app/sections/MeetTechKun";
import ProblemStatement from "@/app/sections/ProblemStatement";
import OurPrinciples from "@/app/sections/OurPrinciples";

export default function Main() {
    return <main>
        <Banner />
        <ProblemStatement />
        <OurPrinciples />
        <MeetTechKun />
        <Cofounders />
        <ContactUs />
    </main>;
}