import Head from 'next/head'
import dynamic from "next/dynamic";
import Link from "next/link";
import AOS from 'aos';
import "aos/dist/aos.css";
import { GlobeAsiaAustraliaIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/20/solid'

import { useEffect } from 'react';

const Navbar = dynamic(() => import("../components/Navbar"));
const Footer = dynamic(() => import("../components/Footer"));

export default function Home({ webData }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    AOS.init();
  }, [])

  const ContextualizeString = (string, variables) => {
    return string?.split(/\[.*\]/)?.join(variables?.[string?.split('[')?.pop()?.split(']')?.[0]])
  }

  const features = [
    {
      name: 'Easy to use.',
      description:
        `Our app is designed with ease of use in mind. We understand that navigating new technology can be a challenge, which is why we've made it simple and straightforward.`,
      icon: GlobeAsiaAustraliaIcon,
    },
    {
      name: 'Frequent updates.',
      description: `We are dedicated to providing our users with the best experience possible. That's why we are constantly updating and improving our app with the latest features and advancements to beat emerging AI detectors.`,
      icon: ArrowPathIcon,
    },
    {
      name: 'Full encryption.',
      description: `privacy and security of your information is of the utmost importance. We use state-of-the-art data encryption to ensure that your personal information is protected.`,
      icon: LockClosedIcon,
    },
  ]

  return (
    <>
      <Head>
        <title>{webData.header.title}</title>
        <meta name="description" content={webData.header.description} />
        <link rel="icon" href={webData.header.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="w-full min-h-screen" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
        <div className="w-full h-fit fixed top-0" style={{ zIndex: 9 }}>
          <Navbar webData={webData} session={false} transparent={true} scrollFade={true} />
        </div>

        <div className={`hero min-h-screen h-fit flex items-center justify-center`}>
          <div className="hero-content text-center">
            <div className="max-w-fit px-10">
              <h1 className="text-4xl md:text-5xl font-bold text-center" data-aos-delay="200" data-aos-duration="700" data-aos="fade-up">{webData.hero.title}</h1>
              <p className="py-6 max-w-md mr-auto ml-auto text-center" data-aos-delay="400" data-aos-duration="700" data-aos="fade-up">{ContextualizeString(webData.hero.description, webData.variables)}</p>
              <Link href="/auth/signup">
                <button className={`btn btn-primary`} data-aos-delay="700" data-aos-duration="700" data-aos="fade-in">Get Started</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full h-fit min-h-screen flex justify-center items-center">
          <div className="overflow-hidden w-full py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600" data-aos="fade-up" data-aos-duration="600" data-aos-delay="30">Smart Rewrite</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="60">Human-Like Experience</p>
                    <p className="mt-6 text-lg leading-8 text-gray-300" data-aos="fade-up" data-aos-duration="1400" data-aos-delay="90">
                      Take your chat experience to the next level with our app that delivers more human-like responses, making communication more engaging and satisfying.
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature, index) => (
                        <div key={feature.name} className="relative pl-9" data-aos="fade-up" data-aos-duration={1400+(200*index)} data-aos-delay={90+(30*index)}>
                          <dt className="inline font-semibold text-gray-100">
                            <feature.icon className="absolute top-1 left-1 h-5 w-5 text-indigo-300" aria-hidden="true" />
                            {feature.name}
                          </dt>{' '}
                          <dd className="inline text-gray-300">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <img
                  data-aos="fade-left"
                  data-aos-delay="100"
                  data-aos-duration="800"
                  src="/images/demo.png"
                  alt="Product screenshot"
                  className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-fit flex items-center justify-center min-h-screen">
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col">
                <div className="h-1 bg-velvet-light rounded overflow-hidden" data-aos="fade-in" data-aos-duration="700">
                  <div className="w-36 h-full bg-primary"></div>
                </div>
                <div className="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
                  <h1 className="sm:w-2/5 text-gray-100 font-medium title-font text-2xl mb-2 sm:mb-0" data-aos="fade-in" data-aos-duration="700" data-aos-delay="200">Use Your Own Prompts</h1>
                  <p className="sm:w-3/5 text-gray-300 leading-relaxed text-base sm:pl-10 pl-0 text-right" data-aos="fade-in" data-aos-duration="700" data-aos-delay="400">Use your own customized prompts for more control over how the API rewrites the text.</p>
                </div>
              </div>
              <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
                <div className="p-4 md:w-1/3 sm:mb-0 mb-6" data-aos="zoom-in" data-aos-duration="700" data-aos-delay="600">
                  <h2 className="text-xl font-medium title-font text-gray-100 mt-5">Advanced/Pro Writing</h2>
                  <p className="text-base leading-relaxed mt-2 text-gray-300"> Rewrite the following text as if you are a professional writer with fun and unique words that are commonly used.</p>
                  <a href="/auth/signup" className="text-indigo-500 cursor-pointer inline-flex items-center mt-3">Try it free
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <div className="p-4 md:w-1/3 sm:mb-0 mb-6" data-aos="zoom-in" data-aos-duration="700" data-aos-delay="700">
                  <h2 className="text-xl font-medium title-font text-gray-100 mt-5">Fun & Playful writing</h2>
                  <p className="text-base leading-relaxed mt-2 text-gray-300">Rewrite the following text and make it pop with lots of fun, playful, and unique words.</p>
                  <a href="/auth/signup" className="text-indigo-500 cursor-pointer inline-flex items-center mt-3">Try it free
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <div className="p-4 md:w-1/3 sm:mb-0 mb-6" data-aos="zoom-in" data-aos-duration="700" data-aos-delay="800">
                  <h2 className="text-xl font-medium title-font text-gray-100 mt-5">SEO/Web Content</h2>
                  <p className="text-base leading-relaxed mt-2 text-gray-300">Rewrite the following text in a way that isn't typical to AI, Use complex and unique words.</p>
                  <a href="/auth/signup" className="text-indigo-500 cursor-pointer inline-flex items-center mt-3">Try it free
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer webData={webData} color="bg-purple-dark" />
    </>
  )
}
