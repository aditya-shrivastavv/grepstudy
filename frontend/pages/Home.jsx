import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import HighlightText from '../components/main/home/HighlightText'
import ButtonsYB from '../components/main/home/ButtonsYB'

function Home() {
  return (
    <div className="relative text-white mx-auto flex flex-col w-11/12 items-center justify-between max-w-maxContent gap-8">
      {/* Become instructor button */}

      <Link to="/signup">
        <div className="group mx-auto mt-16 w-fit rounded-full bg-richBlack-800 p-1 font-bold text-richBlack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95">
          <span className="flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richBlack-900">
            <p>Become an instructor</p>
            <FaArrowRight />
          </span>
        </div>
      </Link>

      {/* Heading */}

      <div className="text-center text-4xl font-semibold">
        Empower Your Future with
        <HighlightText text={'Coding Skills'} />
      </div>

      {/* Sub-Heading */}

      <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richBlack-300">
        With our online coding courses, you can learn at your own pace, from
        anywhere in the world, and get access to a wealth of resources,
        including hands-on projects, quizzes, and personalized feedback from
        instructors.
      </div>

      {/* Buttons */}

      <div className="mt-8 flex flex-row gap-7">
        <ButtonsYB isYellow={true} linkTo={'/signup'}>
          Learn More
        </ButtonsYB>
        <ButtonsYB isYellow={false} linkTo={'/login'}>
          Book a Demo
        </ButtonsYB>
      </div>

      <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
        <video
          className="shadow-[20px_20px_rgba(255,255,255)]"
          muted
          loop
          autoPlay
        >
          <source src={Banner} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

export default Home
