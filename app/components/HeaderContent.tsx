import React, { SetStateAction, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Linking } from "react-native";
import Routes from "../config/Routes";
import { DeFiButton } from "../elements/Buttons";
import { Environment } from "../env/Environment";
import withSession from "../hocs/withSession";
import withSettings from "../hocs/withSettings";
import { useDevice } from "../hooks/useDevice";
import { Language } from "../models/Language";
import { UserRole } from "../models/User";
import { putUserLanguage } from "../services/ApiService";
import { Session } from "../services/AuthService";
import SessionService from "../services/SessionService";
import SettingsService, { AppSettings } from "../services/SettingsService";
import AppStyles from "../styles/AppStyles";
import { navigate } from "../utils/NavigationHelper";
import { resolve } from "../utils/Utils";
import DeFiDropdown from "./form/DeFiDropdown";

const HeaderContent = ({ session, settings }: { session?: Session; settings?: AppSettings }) => {
  const { t } = useTranslation();
  const device = useDevice();

  const [selectedLanguage, setSelectedLanguage] = useState(Environment.defaultLanguage);

  useEffect(() => {
    if (settings) {
      setSelectedLanguage(settings.language);
    }
  }, [settings]);

  const logout = () => SessionService.logout();
  const getLanguage = (symbol: string): Language | undefined => SettingsService.Languages.find((l) => l.symbol === symbol);
  const languageChanged = (update: SetStateAction<Language | undefined>) => {
    const language = resolve(update, getLanguage(selectedLanguage));
    if (language) {
      SettingsService.updateSettings({ language: language.symbol });
      if (session?.isLoggedIn) {
        putUserLanguage(language);
      }
    }
  };

  const links = [
    { key: "general.FAQ", url: "https://defichain-wiki.com/wiki/DFX_FAQ" },
    { key: "general.homepage", url: "https://DFX.swiss/" },
    { key: "general.telegram", url: "https://t.me/DeFiChange" },
  ];

  return (
    <View style={device.SM && AppStyles.containerHorizontal}>
      {session?.isLoggedIn && (
        <DeFiButton onPress={logout} style={styles.button} compact>
          {t("action.logout")}
        </DeFiButton>
      )}

      {session?.role == UserRole.Admin && (
        <DeFiButton onPress={() => navigate(Routes.Admin)} style={styles.button} compact>
          {t("admin.title")}
        </DeFiButton>
      )}

      {links.map((link) => (
        <DeFiButton key={link.key} onPress={() => Linking.openURL(link.url)} style={styles.button} compact>
          {t(link.key)}
        </DeFiButton>
      ))}

      {SettingsService.Languages?.length > 0 && (
        <DeFiDropdown
          value={getLanguage(selectedLanguage)}
          setValue={languageChanged}
          items={SettingsService.Languages}
          idProp="symbol"
          labelProp="foreignName"
          title={t("general.select_language")}
          style={styles.button}
        ></DeFiDropdown>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
  },
});

export default withSettings(withSession(HeaderContent));
