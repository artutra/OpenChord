import React, { FC, useContext, useState } from "react";
import { View, Text, Linking } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LanguageContext from "../languages/LanguageContext";
import PrimaryButton from "../components/PrimaryButton";
import Checkbox from "../components/Checkbox";
import { GlobalSettings } from "../db/GlobalSettings";

const AcceptTerms: FC<{ onAgree: () => void }> = ({ onAgree }) => {
  const { t, language } = useContext(LanguageContext)
  const [check, setCheck] = useState(false)

  async function goToTermsAndConditions() {
    await Linking.openURL('https://cifrabox.com/termos-e-condicoes?lang=' + language)
  }

  async function goToPrivacyPolicy() {
    await Linking.openURL('https://cifrabox.com/termos-e-condicoes?lang=' + language)
  }

  function onPressAgree() {
    GlobalSettings.setTermsAndConditions(true)
    onAgree()
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons style={{}} size={150} color="#ccc" name="check-circle-outline" />
        <Text style={{ fontSize: 30, marginTop: 50 }}>{t('accept_terms')}</Text>

      </View>
      {language === 'en_us' &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Checkbox onValueChange={(v) => setCheck(v)} value={check} />
              </View>
              <Text style={{ flexWrap: 'wrap', lineHeight: 26, marginLeft: 12, fontSize: 18 }}>
                <Text style={{ fontSize: 18 }}>I read and agree to Cifrabox {'\n'}</Text>
                <Text onPress={goToTermsAndConditions} style={{ fontSize: 18, color: 'blue', textDecorationLine: 'underline' }} >
                  Terms and Conditions
                </Text>
                <Text> and {'\n'}</Text>
                <Text onPress={goToPrivacyPolicy} style={{ fontSize: 18, color: 'blue', textDecorationLine: 'underline' }}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
            {check ?
              <PrimaryButton title='OK' onPress={onPressAgree} />
              : <Text style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#ccc', color: '#666', paddingVertical: 10 }}>OK</Text>
            }
          </View>
        </View>
      }
      {language === 'pt_br' &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Checkbox onValueChange={(v) => setCheck(v)} value={check} />
              </View>
              <Text style={{ flexWrap: 'wrap', lineHeight: 26, marginLeft: 12, fontSize: 18 }}>
                <Text style={{ fontSize: 18 }}>Eu li e concordo com os {'\n'}</Text>
                <Text onPress={goToTermsAndConditions} style={{ fontSize: 18, color: 'blue', textDecorationLine: 'underline' }} >
                  Termos e Condições
                </Text>
                <Text> e a {'\n'}</Text>
                <Text onPress={goToPrivacyPolicy} style={{ fontSize: 18, color: 'blue', textDecorationLine: 'underline' }}>
                  Politica de Privacidade
                </Text>
                <Text> do Cifrabox</Text>
              </Text>
            </View>
            {check ?
              <PrimaryButton title='OK' onPress={onPressAgree} />
              : <Text style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#ccc', color: '#666', paddingVertical: 10 }}>OK</Text>
            }
          </View>
        </View>
      }
    </View>
  )
}
export default AcceptTerms