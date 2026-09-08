'use client'
import Banner from "@/app/sections/01_Banner/component";
import ProblemStatement from "@/app/sections/02_Problem_Statement/component";
import OurPrinciples from "@/app/sections/03_Our_Principles/component";
import MeetTechKun from "@/app/sections/04_Meet_TechKun/component";
import Cofounders from "@/app/sections/05_Cofounders/component";
import ContactUs from "@/app/sections/06_Contact_Us/component";

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