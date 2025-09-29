import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Card,
  Text,
  Button,
  TextInput,
  Switch,
  List,
  Divider,
  Chip,
  IconButton,
  ActivityIndicator
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ReportField } from '../types';

interface AddFieldModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddField: (field: Omit<ReportField, 'id' | 'order'>) => void;
}

const fieldTypes = [
  {
    type: 'text' as const,
    name: 'Texto',
    description: 'Campo de texto simples (uma linha)',
    icon: 'text',
    color: '#2196F3'
  },
  {
    type: 'textarea' as const,
    name: 'Texto Longo',
    description: 'Campo de texto com múltiplas linhas',
    icon: 'text-long',
    color: '#4CAF50'
  },
  {
    type: 'select' as const,
    name: 'Lista Suspensa',
    description: 'Seleção única entre opções predefinidas',
    icon: 'menu-down',
    color: '#FF9800'
  },
  {
    type: 'checkbox' as const,
    name: 'Checkbox',
    description: 'Campo de seleção verdadeiro/falso',
    icon: 'checkbox-marked',
    color: '#9C27B0'
  },
  {
    type: 'file' as const,
    name: 'Arquivo',
    description: 'Upload de arquivos diversos',
    icon: 'file',
    color: '#607D8B'
  },
  {
    type: 'image' as const,
    name: 'Imagem',
    description: 'Upload específico para imagens',
    icon: 'image',
    color: '#E91E63'
  }
];

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  visible,
  onDismiss,
  onAddField
}) => {
  const [step, setStep] = useState<'type' | 'config'>('type');
  const [selectedType, setSelectedType] = useState<ReportField['type'] | null>(null);
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>(['']);

  const resetModal = () => {
    setStep('type');
    setSelectedType(null);
    setLabel('');
    setPlaceholder('');
    setRequired(false);
    setOptions(['']);
  };

  const handleDismiss = () => {
    resetModal();
    onDismiss();
  };

  const handleTypeSelect = (type: ReportField['type']) => {
    setSelectedType(type);
    setStep('config');
    
    // Configurações padrão baseadas no tipo
    const typeConfig = fieldTypes.find(t => t.type === type);
    if (typeConfig) {
      setLabel(typeConfig.name);
      if (type === 'select') {
        setOptions(['Opção 1', 'Opção 2']);
      }
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreateField = () => {
    if (!selectedType || !label.trim()) return;

    const fieldData: Omit<ReportField, 'id' | 'order'> = {
      type: selectedType,
      label: label.trim(),
      required,
      ...(placeholder && { placeholder: placeholder.trim() }),
      ...(selectedType === 'select' && { 
        options: options.filter(opt => opt.trim()).map(opt => opt.trim()) 
      })
    };

    onAddField(fieldData);
    handleDismiss();
  };

  const selectedTypeConfig = selectedType ? fieldTypes.find(t => t.type === selectedType) : null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Content>
            {step === 'type' ? (
              <>
                <View style={styles.header}>
                  <Text variant="headlineSmall" style={styles.title}>Adicionar Campo</Text>
                  <Text style={styles.subtitle}>
                    Selecione o tipo de campo que deseja adicionar
                  </Text>
                </View>

                <ScrollView style={styles.typesList}>
                  {fieldTypes.map((fieldType, index) => (
                    <View key={fieldType.type}>
                      <List.Item
                        title={fieldType.name}
                        description={fieldType.description}
                        left={props => (
                          <View style={[styles.iconContainer, { backgroundColor: fieldType.color }]}>
                            <Ionicons 
                              name={fieldType.icon} 
                              size={24} 
                              color="#fff" 
                            />
                          </View>
                        )}
                        right={props => (
                          <IconButton
                            icon="chevron-right"
                            size={20}
                            onPress={() => handleTypeSelect(fieldType.type)}
                          />
                        )}
                        onPress={() => handleTypeSelect(fieldType.type)}
                        style={styles.typeItem}
                      />
                      {index < fieldTypes.length - 1 && <Divider />}
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.header}>
                  <View style={styles.backHeader}>
                    <IconButton
                      icon="arrow-left"
                      size={24}
                      onPress={() => setStep('type')}
                    />
                    <View>
                      <Text variant="headlineSmall" style={styles.configTitle}>Configurar Campo</Text>
                      {selectedTypeConfig && (
                        <View style={styles.selectedType}>
                          <Chip
                            icon={selectedTypeConfig.icon}
                            style={{ backgroundColor: selectedTypeConfig.color }}
                            textStyle={{ color: '#fff' }}
                          >
                            {selectedTypeConfig.name}
                          </Chip>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <ScrollView style={styles.configForm}>
                  <TextInput
                    label="Nome do campo *"
                    value={label}
                    onChangeText={setLabel}
                    mode="outlined"
                    style={styles.input}
                    placeholder="Ex: Nome completo"
                  />

                  <TextInput
                    label="Texto de ajuda (opcional)"
                    value={placeholder}
                    onChangeText={setPlaceholder}
                    mode="outlined"
                    style={styles.input}
                    placeholder="Ex: Digite seu nome completo"
                  />

                  <View style={styles.switchContainer}>
                    <View style={styles.switchLabel}>
                      <Text style={styles.switchText}>Campo obrigatório</Text>
                      <Text style={styles.switchDescription}>
                        O usuário deve preencher este campo
                      </Text>
                    </View>
                    <Switch
                      value={required}
                      onValueChange={setRequired}
                    />
                  </View>

                  {selectedType === 'select' && (
                    <View style={styles.optionsSection}>
                      <Text style={styles.optionsTitle}>Opções da lista</Text>
                      <Text style={styles.optionsDescription}>
                        Configure as opções disponíveis para seleção
                      </Text>

                      {options.map((option, index) => (
                        <View key={index} style={styles.optionItem}>
                          <TextInput
                            label={`Opção ${index + 1}`}
                            value={option}
                            onChangeText={(value) => handleUpdateOption(index, value)}
                            mode="outlined"
                            style={styles.optionInput}
                            placeholder={`Opção ${index + 1}`}
                          />
                          {options.length > 1 && (
                            <IconButton
                              icon="delete"
                              size={20}
                              iconColor="#F44336"
                              onPress={() => handleRemoveOption(index)}
                            />
                          )}
                        </View>
                      ))}

                      <Button
                        mode="outlined"
                        onPress={handleAddOption}
                        style={styles.addOptionButton}
                        icon="plus"
                      >
                        Adicionar Opção
                      </Button>
                    </View>
                  )}
                </ScrollView>
              </>
            )}

            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.actionButton}
              >
                Cancelar
              </Button>
              
              {step === 'config' && (
                <Button
                  mode="contained"
                  onPress={handleCreateField}
                  style={styles.actionButton}
                  disabled={!label.trim()}
                >
                  Adicionar Campo
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  card: {
    maxHeight: '90%',
    elevation: 8,
  },
  header: {
    marginBottom: 20,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -12,
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  configTitle: {
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  selectedType: {
    marginTop: 4,
  },
  typesList: {
    maxHeight: 400,
  },
  typeItem: {
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  configForm: {
    maxHeight: 400,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#666',
  },
  optionsSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionsDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  addOptionButton: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AddFieldModal;