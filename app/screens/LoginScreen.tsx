import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, Button, View, Text, ScrollView } from "react-native";
import Form from "../components/form/Form";
import Loading from "../components/util/Loading";
import Colors from "../config/Colors";
import Routes from "../config/Routes";
import { SpacerV } from "../elements/Spacers";
import { Alert, H2, H3 } from "../elements/Texts";
import SessionService from "../services/SessionService";
import AppStyles from "../styles/AppStyles";
import VideoPlayer from "../components/util/VideoPlayer";
import { Environment } from "../env/Environment";
import { changeLanguage } from "../i18n/i18n";
import Input from "../components/form/Input";

interface LoginData {
  userName: string;
  password: string;
}

const signingMessage = (address: string) =>
  `By signing this message, you confirm that you are the sole owner of the provided Bitcoin address and are in possession of its private key.

Your ID: ${address}`;

const LoginScreen = () => {
  const nav = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginData>();
  const address = useWatch({ control, name: "userName", defaultValue: "" });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);
  const [addressEntered, setAddressEntered] = useState(false);

  const onSubmit = (direct: boolean) => (data: LoginData) => {
    if (!direct && !addressEntered) {
      setAddressEntered(true);
      return;
    }

    setIsProcessing(true);
    setError(false);

    if (Environment.debug && data.userName === "admin") {
      data = {
        userName: "8MVnL9PZ7yUoRMD4HAnTQn5DAHypYiv1yG",
        password: "Hwj3sJjBxMOnkPxZkGtqinGdASIOM6ffGDCcQsWA7kRIIjMP5/HMyuZwlLnBKuD6weD5c/8HIzMrmi6GpCmFU04=",
      };
    }

    SessionService.login({ address: data.userName, signature: data.password })
      .finally(() => setIsProcessing(false))
      .then(() => nav.navigate(Routes.Home))
      .catch(() => setError(true));
  };

  useEffect(() => {
    const params = route.params as any;
    if (params?.lang) {
      changeLanguage(params.lang);
    }
    if (params?.address && params?.signature) {
      setValue("userName", params.address);
      setValue("password", params.signature);
      handleSubmit(onSubmit(true))();
    }
  }, []);

  const rules: any = {
    userName: {
      required: {
        value: true,
        message: t("validation.required"),
      },
    },
    password: {
      required: {
        value: true,
        message: t("validation.required"),
      },
    },
  };

  // TODO: focus signature on enter
  return (
    <ScrollView style={AppStyles.container}>
      <View style={[AppStyles.container, styles.container]}>
        <SpacerV height={20} />
        <VideoPlayer src="https://www.youtube.com/embed/DubUrIPFajA" maxWidth={600} />
        <SpacerV height={30} />
        <H2 text={t("session.sign_up")} />
        <View style={styles.formContainer}>
          <Form
            control={control}
            rules={rules}
            errors={errors}
            editable={!isProcessing}
            onSubmit={handleSubmit(onSubmit(false))}
          >
            <Input
              name="userName"
              label={t("model.user.legacy_address")}
              returnKeyType="next"
              placeholder="8MVnL9PZ7yUoRMD4HAnTQn5DAHypYiv1yG"
            />

            <>
              {addressEntered && (
                <>
                  <SpacerV />
                  <H3 text={t("session.signing_message")}></H3>
                  <Text style={styles.signingMessage}>{signingMessage(address)}</Text>
                  <SpacerV />
                  {/* TODO: verify go type */}
                  <Input name="password" label={t("model.user.signature")} returnKeyType="go" />
                </>
              )}
            </>

            <>
              {error && (
                <>
                  <SpacerV />
                  <Alert label={t("session.login_failed")} />
                </>
              )}
            </>
            <SpacerV />
            <View style={[AppStyles.containerHorizontal, AppStyles.mla]}>
              <View style={isProcessing && AppStyles.hidden}>
                <Button
                  color={Colors.Primary}
                  title={t(addressEntered ? "action.login" : "action.next")}
                  onPress={handleSubmit(onSubmit(false))}
                  disabled={isProcessing}
                />
              </View>
              <>{isProcessing && <Loading />}</>
            </View>
          </Form>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  signingMessage: {
    padding: 5,
    borderColor: Colors.Grey,
    borderRadius: 5,
    backgroundColor: Colors.LightGrey,
  },
});

export default LoginScreen;
