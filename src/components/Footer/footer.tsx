import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { SiVisa, SiPaypal, SiMastercard } from "react-icons/si";

interface FooterSectionProps {
  title: string;
  links: { text: string; url: string }[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <div className="space-y-4">
    <h5 className="text-lg font-semibold mb-2">{title}</h5>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={link.url}
            className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200 block py-1"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

interface SocialIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  url: string;
  hoverColor: string;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  Icon,
  url,
  hoverColor,
  label,
}) => (
  <Link
    to={url}
    className={`text-gray-600 hover:${hoverColor} transition-colors duration-200 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm`}
    aria-label={label}
  >
    <Icon className="text-xl" />
  </Link>
);

const Footer = () => {
  return (
    <footer className="bg-white py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <h4 className="text-2xl font-bold text-blue-600">KoiNe</h4>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sed viverra eget fames sit varius. Pellentesque mattis libero
              viverra dictumst ornare sed justo convallis vitae.
            </p>
            <div className="flex space-x-4">
              <SocialIcon
                Icon={FaFacebookF}
                url="/"
                hoverColor="text-blue-600"
                label="Facebook"
              />
              <SocialIcon
                Icon={FaInstagram}
                url="/"
                hoverColor="text-pink-600"
                label="Instagram"
              />
              <SocialIcon
                Icon={FaTwitter}
                url="/"
                hoverColor="text-blue-400"
                label="Twitter"
              />
              <SocialIcon
                Icon={FaYoutube}
                url="https://www.youtube.com/@thefishdoctor8746"
                hoverColor="text-red-600"
                label="YouTube"
              />
            </div>
          </div>

          {/* Company Links */}
          <FooterSection
            title="Company"
            links={[{ text: "About Us", url: "/about-us" }]}
          />

          {/* Useful Links */}
          <FooterSection
            title="Useful Links"
            links={[
              { text: "New Products", url: "/" },
              { text: "Fish Service", url: "/services" },
            ]}
          />

          {/* Customer Service */}
          <FooterSection
            title="Customer Service"
            links={[
              { text: "Contact Us", url: "/contact-us" },
              { text: "Returns", url: "/" },
            ]}
          />

          {/* Store Info */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Service Center</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0 text-blue-500" />
                <span>
                  8592 Fairground St. <br />
                  Tallahassee, FL 32303
                </span>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                <a
                  href="tel:+84087786789"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  +84 087-786-7896
                </a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-500" />
                <a
                  href="mailto:rgarton@outlook.com"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  rgarton@outlook.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-sm text-gray-500">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p>
              &copy; {new Date().getFullYear()} Pet Shop. All rights reserved.
              Design by Figma.guru
            </p>
            <div className="flex space-x-4 items-center">
              <span className="text-gray-600 mr-2">Accepted Payments</span>
              <SiVisa className="text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-200" />
              <SiPaypal className="text-2xl text-gray-600 hover:text-blue-800 transition-colors duration-200" />
              <SiMastercard className="text-2xl text-gray-600 hover:text-orange-600 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
