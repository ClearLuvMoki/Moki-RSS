import { motion } from "motion/react";

const variants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 100 },
};

interface Props {
  content: React.ReactNode;
}

const SiderItem = ({ content }: Props) => {
  return <motion.div variants={variants}>{content}</motion.div>;
};

export default SiderItem;
