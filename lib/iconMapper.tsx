import {
  FaHandshake,
  FaUsers,
  FaRocket,
  FaCalendarAlt,
  FaComments,
  FaBrain,
  FaBriefcase,
  FaSpa,
  FaClock,
  FaHandsHelping,
  FaLaptop,
} from "react-icons/fa";

const iconMap: { [key: string]: React.ComponentType<{ size?: number }> } = {
  FaHandshake,
  FaUsers,
  FaRocket,
  FaCalendarAlt,
  FaComments,
  FaBrain,
  FaBriefcase,
  FaSpa,
  FaClock,
  FaHandsHelping,
  FaLaptop,
};

export function getIconComponent(iconName: string, size: number = 28) {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap, using default`);
    return <FaCalendarAlt size={size} />;
  }
  return <IconComponent size={size} />;
}

