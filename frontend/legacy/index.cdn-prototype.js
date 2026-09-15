// We'll need to wait for the scripts to load, but since we are using CDN and the scripts are in the head, we can assume they are loaded.
// However, to be safe, we'll wrap the app in a function that runs after load.

// We'll create the app using React and ReactDOM from the global variables (since we loaded them via CDN)

const { useState, useEffect, useRef } = React;
const { Link, BrowserRouter, Routes, Route, NavLink } = ReactRouterDOM;
const { motion, useAnimate } = FramerMotion;
const { Canvas, useThree } = ReactThreeFiber;
const { OrbitControls, Stats } = Drei;
const { IoLogoGithub, IoLogoLinkedin, IoLogoInstagram, IoLogoWhatsapp } = LucideIcons;

// We'll define our color palette and other constants
const colors = {
  black: '#000000',
  nearBlack: '#0A0A0A',
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  electricBlue: '#0EA5E9',
  bluePurple: '#6366F1',
};

// We'll create a simple 3D human placeholder (we'll use a basic shape for now)
// In a real scenario, we would load a GLTF model. For simplicity, we'll use a combination of basic shapes.

// Let's create the main App component
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Navbar Component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-black/80 backdrop-blur-xs sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-electricBlue">
              BISSTECH
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-electricBlue pb-1 text-electricBlue'
                  : 'text-white hover:text-gray-300 transition-colors'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-electricBlue pb-1 text-electricBlue'
                  : 'text-white hover:text-gray-300 transition-colors'
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-electricBlue pb-1 text-electricBlue'
                  : 'text-white hover:text-gray-300 transition-colors'
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-electricBlue pb-1 text-electricBlue'
                  : 'text-white hover:text-gray-300 transition-colors'
              }
            >
              Contact
            </NavLink>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-gray-300"
              aria-label="Open menu"
            >
              {isOpen ? (
                <IoLogoGithub size={24} />
              ) : (
                <IoLogoLinkedin size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                block
                px-3
                py-2
                rounded-md
                className={({ isActive }) =>
                  isActive
                    ? 'bg-electricBlue/20 text-electricBlue'
                    : 'text-white hover:bg-gray-800'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                block
                px-3
                py-2
                rounded-md
                className={({ isActive }) =>
                  isActive
                    ? 'bg-electricBlue/20 text-electricBlue'
                    : 'text-white hover:bg-gray-800'
                }
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                block
                px-3
                py-2
                rounded-md
                className={({ isActive }) =>
                  isActive
                    ? 'bg-electricBlue/20 text-electricBlue'
                    : 'text-white hover:bg-gray-800'
                }
              >
                Services
              </NavLink>
              <NavLink
                to="/contact"
                block
                px-3
                py-2
                rounded-md
                className={({ isActive }) =>
                  isActive
                    ? 'bg-electricBlue/20 text-electricBlue'
                    : 'text-white hover:bg-gray-800'
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-electricBlue mb-4">
              BISSTECH
            </h3>
            <p className="text-gray-400">
              Build. Grow. Automate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white hover:text-gray-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Digital Marketing</li>
              <li className="text-gray-400">Website Development</li>
              <li className="text-gray-400">E-commerce & Quick Commerce</li>
              <li className="text-gray-400">AI Automation</li>
              <li className="text-gray-400">Graphic Design</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <IoLogoInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <IoLogoLinkedin size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                {/* We don't have Facebook icon in Lucide, so we'll use a placeholder */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <IoLogoWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BISSTECH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Home Page
function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with 3D */}
      <section className="relative h-[100vh] w-full">
        <Hero3D />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            BUILD. GROW. AUTOMATE.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            BISSTECH helps ambitious businesses grow through digital marketing, high-performance websites,
            e-commerce management, AI automation and creative design.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/services"
              className="bg-electricBlue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Start a Project
            </Link>
            <Link
              to="/services"
              className="border border-white/20 hover:border-electricBlue hover:bg-white/10 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Explore Services
            </Link>
          </div>
          {/* Animated metrics placeholders */}
          <div className="mt-10 flex space-x-8 text-gray-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-electricBlue">+120%</div>
              <p>Growth</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electricBlue">+85%</div>
              <p>Leads</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electricBlue">+60%</div>
              <p>Sales</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electricBlue">+200%</div>
              <p>Automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Client Logo Section */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trusted by Innovative Brands Worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Placeholder for client logos */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-24 h-16 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-gray-400">Client {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What BISSTECH Does */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What BISSTECH Does
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-electricBlue">Digital Marketing</h3>
              <p className="text-gray-300">
                Increase visibility, traffic, leads, and revenue through performance-driven strategies.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-electricBlue">Website Development</h3>
              <p className="text-gray-300">
                Modern, responsive, high-performance websites built for conversions.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-electricBlue">E-commerce & Quick Commerce</h3>
              <p className="text-gray-300">
                Build, manage, and scale online commerce operations across platforms.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-electricBlue">AI Automation</h3>
              <p className="text-gray-300">
                Reduce repetitive work and build smarter workflows with AI.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-electricBlue">Graphic Design</h3>
              <p className="text-gray-300">
                From brand identity to marketing creatives that captivate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (brief) */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Core Services
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((index) => (
              <ServiceCard
                key={index}
                number={index + 1}
                title={[
                  'Digital Marketing',
                  'Website Development',
                  'E-commerce & Quick Commerce',
                  'AI Automation',
                  'Graphic Design',
                ][index]}
                description={[
                  'Performance-driven digital marketing to increase visibility and revenue.',
                  'High-performance websites built for conversions and user experience.',
                  'Manage and scale e-commerce and quick commerce operations.',
                  'AI-powered automation to streamline business workflows.',
                  'Creative design solutions from brand identity to marketing assets.',
                ][index]}
                icon={[
                  <IoLogoGithub className="h-8 w-8 text-electricBlue" />,
                  <IoLogoLinkedin className="h-8 w-8 text-electricBlue" />,
                  <IoLogoInstagram className="h-8 w-8 text-electricBlue" />,
                  <IoLogoWhatsapp className="h-8 w-8 text-electricBlue" />,
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-electricBlue"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H6z"></path>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  </svg>
                ][index]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Digital Growth / Results Section */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Digital Growth & Results
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-electricBlue mb-4">
                Proven Growth Strategies
              </p>
              <p className="text-gray-300 mb-6">
                We combine data-driven insights with creative execution to deliver measurable
                results that scale your business.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>
                  <IoLogoGithub className="h-5 w-5 text-electricBlue mr-3" /> SEO & Content Strategy
                </li>
                <li>
                  <IoLogoLinkedin className="h-5 w-5 text-electricBlue mr-3" /> Paid Media Campaigns
                </li>
                <li>
                  <IoLogoInstagram className="h-5 w-5 text-electricBlue mr-3" /> Conversion Rate Optimization
                </li>
                <li>
                  <IoLogoWhatsapp className="h-5 w-5 text-electricBlue mr-3" /> Marketing Automation
                </li>
              </ul>
            </div>
            <div className="relative">
              {/* Placeholder for a 3D growth chart or visualization */}
              <div className="w-full h-96 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 italic">3D Growth Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Interactive Services Experience */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Interactive 3D Services Experience
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* We'll create interactive 3D cards for each service */}
            {[0, 1, 2, 3, 4].map((index) => (
              <InteractiveService3D
                key={index}
                service={[
                  'Digital Marketing',
                  'Website Development',
                  'E-commerce & Quick Commerce',
                  'AI Automation',
                  'Graphic Design',
                ][index]}
                description={[
                  'Explore our digital marketing strategies in immersive 3D.',
                  'Interact with website development concepts in a virtual space.',
                  'Manage e-commerce operations in a dynamic 3D environment.',
                  'Visualize AI automation workflows in real-time.',
                  'Create and manipulate graphic design elements in 3D space.'
                ][index]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why BISSTECH */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Choose BISSTECH?
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                Expertise & Innovation
              </p>
              <p className="text-gray-300">
                Our team combines deep industry knowledge with cutting-edge
                technology to deliver innovative solutions.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                Client-Centric Approach
              </p>
              <p className="text-gray-300">
                We prioritize your business goals and work collaboratively
                to achieve measurable results.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                Global Perspective
              </p>
              <p className="text-gray-300">
                With a global mindset, we understand diverse markets and
                cultural nuances to create universally effective strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process / How We Work */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Process
          </p>
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-4xl space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-electricBlue/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-electricBlue">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Discovery & Strategy
                  </p>
                  <p className="text-gray-300">
                    We begin by understanding your business, audience, and goals
                    to craft a tailored strategy.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-electricBlue/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-electricBlue">02</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Design & Development
                  </p>
                  <p className="text-gray-300">
                    Our team creates innovative designs and develops high-performance
                    solutions that bring your vision to life.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-electricBlue/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-electricBlue">03</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Launch & Optimization
                  </p>
                  <p className="text-gray-300">
                    We deploy your project and continuously optimize for
                    maximum performance and results.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-electricBlue/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-electricBlue">04</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Growth & Scale
                  </p>
                  <p className="text-gray-300">
                    We help you scale your success with ongoing support and
                    strategic growth initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies / Tools */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Technologies We Use
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                React & Three.js
              </p>
              <p className="text-gray-300">
                For immersive 3D experiences and interactive interfaces.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                AI & Machine Learning
              </p>
              <p className="text-gray-300">
                To automate workflows and build intelligent solutions.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                Modern Web Technologies
              </p>
              <p className="text-gray-300">
                HTML5, CSS3, JavaScript, and the latest frameworks.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-electricBlue mb-4">
                Cloud & DevOps
              </p>
              <p className="text-gray-300">
                For scalable, secure, and high-performance deployments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Portfolio */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Work
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CaseStudyCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What Our Clients Say
          </p>
          <div className="space-y-8">
            <Testimonial />
            <Testimonial />
            <Testimonial />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Digital Future?
          </p>
          <p className="text-xl text-gray-300 mb-8">
            Let's turn your ideas into measurable growth and success.
          </p>
          <Link
            to="/contact"
            className="bg-electricBlue hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}

// About Page
function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-8">
            About BISSTECH
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-electricBlue mb-6">
                Who We Are
              </p>
              <p className="text-gray-300 mb-6">
                BISSTECH is a global digital growth, technology, AI & creative agency
                dedicated to helping ambitious businesses thrive in the digital age.
              </p>
              <p className="text-gray-300 mb-6">
                We combine strategic thinking, technological expertise, and creative
                excellence to deliver solutions that drive real business results.
              </p>
            </div>
            <div className="relative">
              {/* Placeholder for 3D/about visualization */}
              <div className="w-full h-96 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 italic">About Us 3D Visualization</span>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-electricBlue mb-6">
              Our Mission
            </p>
            <p className="text-gray-300 mb-6">
              To empower businesses with innovative digital solutions that drive
              sustainable growth and competitive advantage.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-electricBlue mb-6">
              Our Vision
            </p>
            <p className="text-gray-300 mb-6">
              To be the leading global agency that transforms businesses through
              the seamless integration of strategy, technology, AI, and creativity.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-electricBlue mb-6">
              What We Believe
            </p>
            <ul className="space-y-4 text-gray-300">
              <li>
                <IoLogoGithub className="h-5 w-5 text-electricBlue mr-3" /> Innovation is at the heart of everything we do.
              </li>
              <li>
                <IoLogoLinkedin className="h-5 w-5 text-electricBlue mr-3" /> Collaboration creates better outcomes.
              </li>
              <li>
                <IoLogoInstagram className="h-5 w-5 text-electricBlue mr-3" /> Data-driven decisions lead to measurable results.
              </li>
              <li>
                <IoLogoWhatsapp className="h-5 w-5 text-electricBlue mr-3" /> Creativity fuels engagement and connection.
              </li>
            </ul>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-electricBlue mb-6">
              Why Businesses Choose BISSTECH
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-electricBlue mb-4">
                  Proven Track Record
                </p>
                <p className="text-gray-300">
                  We have a history of delivering successful projects across
                  industries and markets.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-electricBlue mb-4">
                  Holistic Approach
                </p>
                <p className="text-gray-300">
                  We look at the big picture to ensure all elements work together
                  seamlessly for maximum impact.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-electricBlue mb-4">
                  Long-Term Partnership
                </p>
                <p className="text-gray-300">
                  We build relationships that grow with your business over time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/contact"
              className="bg-electricBlue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Services Page
function Services() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-8">
            Our Services
          </p>
          <div className="space-y-12">
            {/* Service 01: Digital Marketing */}
            <ServiceDetail
              number="01"
              title="Digital Marketing"
              description="Help businesses increase visibility, traffic, leads, customer acquisition and revenue through performance-driven digital marketing."
              icon={<IoLogoGithub className="h-8 w-8 text-electricBlue" />}
              subServices={[
                'SEO',
                'Meta Ads',
                'Google Ads',
                'Social Media Marketing',
              ]}
              benefits={[
                'Increased online visibility',
                'Higher quality leads',
                'Improved conversion rates',
                'Enhanced brand awareness',
                'Measurable ROI',
              ]}
            />

            {/* Service 02: Website Development */}
            <ServiceDetail
              number="02"
              title="Website Development"
              description="Design and develop modern, responsive, high-performance websites built around business goals and conversions."
              icon={<IoLogoLinkedin className="h-8 w-8 text-electricBlue" />}
              subServices={[
                'Business Websites',
                'E-commerce Websites',
                'SaaS Websites',
                'Custom Web Applications',
              ]}
              benefits={[
                'Responsive design',
                'Fast loading speeds',
                'SEO-friendly development',
                'Secure and scalable',
                'Easy content management',
              ]}
            />

            {/* Service 03: E-commerce & Quick Commerce Management */}
            <ServiceDetail
              number="03"
              title="E-commerce & Quick Commerce Management"
              description="Help brands build, manage and scale their online commerce operations."
              icon={<IoLogoInstagram className="h-8 w-8 text-electricBlue" />}
              subServices={[
                'Store Setup',
                'Product Optimization',
                'Inventory Management',
                'Order Management',
              ]}
              benefits={[
                'Increased online sales',
                'Streamlined operations',
                'Better customer experience',
                'Marketplace expansion',
                'Data-driven insights',
              ]}
            />

            {/* Service 04: AI Automation */}
            <ServiceDetail
              number="04"
              title="AI Automation"
              description="Use AI and automation to reduce repetitive work, improve efficiency and build smarter business workflows."
              icon={<IoLogoWhatsapp className="h-8 w-8 text-electricBlue" />}
              subServices={[
                'AI Chatbots',
                'Workflow Automation',
                'CRM Automation',
                'AI Content Automation',
              ]}
              benefits={[
                'Reduced operational costs',
                'Increased productivity',
                'Improved accuracy',
                'Enhanced customer satisfaction',
                'Scalable solutions',
              ]}
            />

            {/* Service 05: Graphic Design */}
            <ServiceDetail
              number="05"
              title="Graphic Design"
              description="Create compelling visual identities and marketing materials that capture attention and communicate your brand message."
              icon={(
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-electricBlue"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H6z"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
              )}
              subServices={[
                'Brand Identity',
                'Social Media Design',
                'Marketing Design',
                'Digital Design',
              ]}
              benefits={[
                'Strong brand recognition',
                'Professional appearance',
                'Effective communication',
                'Increased engagement',
                'Competitive advantage',
              ]}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Contact Page
function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      // In a real app, you would send this data to a server
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        details: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-8">
            Let's Build Something That Matters.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                    placeholder="Your Company"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Service Needed</label>
                <select
                  name="service"
                  value={formState.service}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                >
                  <option value="">Select a Service</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="website-development">Website Development</option>
                  <option value="e-commerce">E-commerce & Quick Commerce</option>
                  <option value="ai-automation">AI Automation</option>
                  <option value="graphic-design">Graphic Design</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Budget Range</label>
                <select
                  name="budget"
                  value={formState.budget}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                >
                  <option value="">Select Budget Range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-150k">$50,000 - $150,000</option>
                  <option value="over-150k">Over $150,000</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Project Details</label>
                <textarea
                  name="details"
                  value={formState.details}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electricBlue"
                  rows="6"
                  placeholder="Describe your project, goals, timeline, and any specific requirements..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-electricBlue hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-md transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Start Your Project'}
              </button>
            </form>

            <div className="space-y-6">
              <div className="text-gray-300">
                <h2 className="text-xl font-bold text-white mb-4">Or Contact Us Directly:</h2>
                <p className="flex items-center space-x-3 mb-2">
                  <IoLogoGithub className="h-5 w-5 text-electricBlue" />
                  <span>info@bisstech.com</span>
                </p>
                <p className="flex items-center space-x-3 mb-2">
                  <IoLogoWhatsapp className="h-5 w-5 text-electricBlue" />
                  <span>+1 (555) 123-4567</span>
                </p>
                <p className="flex items-center space-x-3 mb-2">
                  <IoLogoInstagram className="h-5 w-5 text-electricBlue" />
                  <span>@bisstech_agency</span>
                </p>
                <p className="flex items-center space-x-3 mb-2">
                  <IoLogoLinkedin className="h-5 w-5 text-electricBlue" />
                  <span>linkedin.com/company/bisstech</span>
                </p>
              </div>

              {/* Success message */}
              {submitStatus === 'success' && (
                <div className="bg-electricBlue/20 border-l-4 border-electricBlue p-4 rounded-lg">
                  <p className="text-electricBlue font-bold">
                    Thank you! Your message has been sent. We'll get back to you shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ======================
   REUSABLE COMPONENTS
   ====================== */

// Service Card (for homepage)
function ServiceCard({ number, title, description, icon }) {
  return (
    <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-electricBlue/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {number} — {title}
          </p>
          <p className="text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Interactive Service 3D (placeholder)
function InteractiveService3D({ service, description }) {
  return (
    <div className="relative h-96 bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-electricBlue mb-4">
            {service}
          </p>
          <p className="text-gray-300 max-w-md">
            {description}
          </p>
          <button
            className="mt-6 bg-electricBlue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            Explore in 3D
          </button>
        </div>
      </div>
    </div>
  );
}

// Case Study Card (placeholder)
function CaseStudyCard() {
  return (
    <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
      <h3 className="text-lg font-semibold text-white mb-4">
        Project Name
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Industry:</strong> Technology
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Services Provided:</strong> Digital Marketing, Website Development
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Challenge:</strong> Low online visibility and lead generation
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Solution:</strong> Comprehensive digital strategy and website redesign
      </p>
      <p className="text-gray-300 mb-2">
        <strong>Result:</strong> Increased traffic and conversions
      </p>
    </div>
  );
}

// Testimonial (placeholder)
function Testimonial() {
  return (
    <div className="bg-white/10 rounded-lg p-8">
      <p className="italic text-gray-300 mb-6">
        "BISSTECH transformed our digital presence and delivered exceptional results.
        Their expertise in AI automation and digital marketing is unparalleled."
      </p>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">JD</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">John Doe</h3>
          <p className="text-gray-400">CEO, Tech Innovations Inc.</p>
        </div>
      </div>
    </div>
  );
}

// Service Detail (for services page)
function ServiceDetail({
  number,
  title,
  description,
  icon,
  subServices,
  benefits,
}) {
  return (
    <div className="bg-white/10 rounded-lg p-8 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-electricBlue/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            {number} — {title}
          </p>
          <p className="text-gray-300 mb-6">
            {description}
          </p>

          <h3 className="text-xl font-bold text-electricBlue mb-4">
            Sub-Services
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
            {subServices.map((service, index) => (
              <li key={index}>
                {service}
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-electricBlue mb-4">
            Benefits
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {benefits.map((benefit, index) => (
              <li key={index}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ======================
   3D HERO SECTION
   ====================== */

// We'll create a simple 3D scene with a human placeholder and floating elements
function Hero3D() {
  // We'll use a simple group of meshes to represent a human figure
  // In a production app, we would load a GLTF model

  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 2, 5], fov: 45 }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />

      {/* Ground (invisible, just for shadows) */}
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} rotation={[ - Math.PI / 2, 0, 0 ]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Human figure placeholder - we'll use a combination of shapes */}
      <group
        // Add subtle idle animation (breathing)
        scale={1}
        // We'll use a simple animation loop via useFrame if we had react-three-fiber's useFrame
        // Since we're using CDN and basic three.js, we'll use a clock
      >
        {/* Body */}
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 1.8, 16]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Arms */}
        <mesh position={[-1.2, 1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[1.2, 1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
          <meshStandardMaterial color={0x000000} metalness={0.2} roughness={0.8} />
        </mesh>
      </group>

      {/* Floating UI panels and elements */}
      {/* We'll add a few floating elements around the human */}
      <group>
        {/* Floating panel 1 */}
        <mesh position={[-2, 1, -1]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.5, 0.1, 1]} />
          <meshStandardMaterial color={0x0ea5e9} opacity={0.8} transparent />
        </mesh>

        {/* Floating panel 2 */}
        <mesh position={[2, 0.5, 1]} rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[1.2, 0.1, 0.8]} />
          <meshStandardMaterial color={0x0ea5e9} opacity={0.8} transparent />
        </mesh>

        {/* Data elements (spheres) */}
        <mesh position={[-1.5, 2, 0.5]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={0x0ea5e9} emissive={0x0ea5e9} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1.5, 1.5, -0.5]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={0x0ea5e9} emissive={0x0ea5e9} emissiveIntensity={0.5} />
        </mesh>

        {/* Abstract shapes */}
        <mesh position={[-2.5, 0.5, -2]}>
          <torusGeometry args={[0.4, 0.1, 8, 16]} />
          <meshStandardMaterial color={0x6366f1} opacity={0.6} transparent />
        </mesh>
        <mesh position={[2.5, 1, 2]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={0x6366f1} opacity={0.6} transparent />
        </mesh>
      </group>

      {/* Environment - we'll add a subtle gradient background via fog or a large plane */}
      {/* For simplicity, we'll just rely on the canvas background color */}
      {/* In a real app, we might use a gradient texture or a large sphere with shader material */}

      {/* Controls for development - remove in production */}
      <OrbitControls enablePan={false} enableZoom={false} />
      {/* Stats */ }
      {/* <Stats /> */}
    </Canvas>
  );
}

/* ======================
   MAIN
   ====================== */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);