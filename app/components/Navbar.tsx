import { Link } from "react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar slide down
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );

      // Logo entrance
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.3 }
        );
      }

      // Button entrance
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.4 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <nav className="cv-nav" ref={navRef}>
      {/* M-Stripe top accent */}
      <div className="cv-nav__stripe">
        <div className="cv-nav__stripe-blue-light" />
        <div className="cv-nav__stripe-blue-dark" />
        <div className="cv-nav__stripe-red" />
      </div>

      <div className="cv-nav__inner">
        {/* Logo */}
        <Link to="/" className="cv-nav__logo" ref={logoRef as any}>
          {/* M-badge icon */}
          <div className="cv-nav__badge">
            <span className="cv-nav__badge-m">W</span>
          </div>
          <span className="cv-nav__brand">CV WIZARD</span>
        </Link>

        {/* Upload CTA */}
        <Link to="/upload" className="cv-nav__cta" ref={btnRef as any}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>UPLOAD</span>
          <svg
            className="cv-nav__cta-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      <style>{`
        .cv-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(60, 60, 60, 0.4);
        }

        .cv-nav__stripe {
          display: flex;
          height: 3px;
          width: 100%;
        }

        .cv-nav__stripe-blue-light {
          flex: 1;
          background-color: #0066b1;
        }

        .cv-nav__stripe-blue-dark {
          flex: 1;
          background-color: #1c69d4;
        }

        .cv-nav__stripe-red {
          flex: 1;
          background-color: #e22718;
        }

        .cv-nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 24px;
          max-width: 1440px;
          margin: 0 auto;
        }

        .cv-nav__logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .cv-nav__logo:hover {
          opacity: 0.8;
        }

        .cv-nav__badge {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0066b1, #1c69d4, #e22718);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .cv-nav__badge::after {
          content: '';
          position: absolute;
          inset: 1px;
          background-color: #000;
          border-radius: 1px;
        }

        .cv-nav__badge-m {
          position: relative;
          z-index: 1;
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .cv-nav__brand {
          font-family: "Inter", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
        }

        .cv-nav__cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #fff;
          text-decoration: none;
          border: 1px solid #3c3c3c;
          border-radius: 0;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .cv-nav__cta:hover {
          border-color: #fff;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .cv-nav__cta-arrow {
          transition: transform 0.3s ease;
        }

        .cv-nav__cta:hover .cv-nav__cta-arrow {
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .cv-nav__inner {
            padding: 0 16px;
            height: 56px;
          }

          .cv-nav__brand {
            font-size: 16px;
          }

          .cv-nav__cta span {
            display: none;
          }

          .cv-nav__cta {
            padding: 8px 14px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;