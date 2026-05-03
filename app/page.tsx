'use client'
import Banner from "@/app/sections/Banner";
import Cofounders from "@/app/sections/Cofounders";
import ContactUs from "@/app/sections/ContactUs";
import MeetTechKun from "@/app/sections/MeetTechKun";
import ProblemStatement from "@/app/sections/ProblemStatement";

export default function Home() {
    return <>
        <Banner />
        <ProblemStatement />
        <MeetTechKun />
        <Cofounders />
        <ContactUs />
    </>;
}