import { useState } from "react";

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedItem, setSelectedItem] = useState(null);

  const open = (item = null) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return {
    isOpen,
    selectedItem,
    open,
    close,
    setSelectedItem,
  };
};
