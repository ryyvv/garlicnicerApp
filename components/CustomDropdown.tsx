import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface DropdownItem {
  id: string;
  label: string;
  value: any;
}

interface CustomDropdownProps {
  theme: any;
  data: DropdownItem[];
  selectedValue: string;
  placeholder: string;
  onSelect: (item: DropdownItem) => void;
  label?: string;
}

interface CustomDropdownState {
  isVisible: boolean;
}

export class CustomDropdown extends Component<CustomDropdownProps, CustomDropdownState> {
  constructor(props: CustomDropdownProps) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  private handleSelect = (item: DropdownItem): void => {
    this.setState({ isVisible: false });
    this.props.onSelect(item);
  };

  render() {
    const { theme, data, selectedValue, placeholder, label } = this.props;
    const { isVisible } = this.state;

    return (
      <View>
        {label && (
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        )}
        
        <TouchableOpacity
          style={[styles.dropdown, { borderColor: theme.primary }]}
          onPress={() => this.setState({ isVisible: true })}
        >
          <Text style={[styles.dropdownText, { color: selectedValue ? theme.text : theme.text + '80' }]}>
            {selectedValue || placeholder}
          </Text>
          <Text style={[styles.dropdownIcon, { color: theme.text }]}>▼</Text>
        </TouchableOpacity>

        <Modal visible={isVisible} transparent animationType="fade">
          <TouchableOpacity 
            style={styles.overlay}
            onPress={() => this.setState({ isVisible: false })}
          >
            <View style={[styles.modal, { backgroundColor: theme.background, borderColor: theme.primary }]}>
              <Text style={[styles.title, { color: theme.text }]}>Select {label || 'Option'}</Text>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.option}
                  onPress={() => this.handleSelect(item)}
                >
                  <Text style={[styles.optionText, { color: theme.text }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
});