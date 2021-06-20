import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-native";
import { View } from "react-native";
import DeFiModal from "../../components/util/DeFiModal";
import Loading from "../../components/util/Loading";
import Row from "../../components/util/Row";
import UserEdit from "../../components/edit/UserEdit";
import Colors from "../../config/Colors";
import Routes from "../../config/Routes";
import { SpacerV } from "../../elements/Spacers";
import { H1, H2 } from "../../elements/Texts";
import withCredentials from "../../hocs/withCredentials";
import { User } from "../../models/User";
import { getActiveRoutes, getUser } from "../../services/ApiService";
import AppStyles from "../../styles/AppStyles";
import { BuyRoute } from "../../models/BuyRoute";
import { SellRoute } from "../../models/SellRoute";
import { Credentials } from "../../services/AuthService";
import RouteList from "./RouteList";

const HomeScreen = ({ credentials }: { credentials?: Credentials }) => {
  const { t } = useTranslation();
  const nav = useNavigation();
  const isFocused = useIsFocused();

  // TODO: full KYC Access
  // TODO: scrollable!

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [buyRoutes, setBuyRoutes] = useState<BuyRoute[]>();
  const [sellRoutes, setSellRoutes] = useState<SellRoute[]>();
  const [isUserEdit, setIsUserEdit] = useState(false);

  const onUserChanged = (user: User) => {
    setUser(user);
    setIsUserEdit(false);
  };

  const reset = (): void => {
    setLoading(true);
    setUser(undefined);
    setBuyRoutes([]);
    setSellRoutes([]);
    setIsUserEdit(false);
  };

  useEffect(() => {
    if (credentials) {
      if (credentials.isLoggedIn) {
        Promise.all([
          getUser().then((user) => setUser(user)),
          getActiveRoutes().then((routes) => {
            setBuyRoutes(routes.buyRoutes);
            setSellRoutes(routes.sellRoutes);
          }),
        ])
          // TODO: error handling everywhere
          .finally(() => setLoading(false));
      } else {
        reset();
        nav.navigate(Routes.Login);
      }
    }
  }, [credentials, isFocused]);

  return (
    <>
      <DeFiModal isVisible={isUserEdit} setIsVisible={setIsUserEdit} title={t("model.user.edit")}>
        <UserEdit isVisible={isUserEdit} user={user} onUserChanged={onUserChanged} />
      </DeFiModal>

      <View style={AppStyles.container}>
        <H1 text={t("welcome")} style={AppStyles.center} />

        <SpacerV height={50} />

        {isLoading && <Loading size="large" />}

        {!isLoading ? (
          <>
            {user && (
              <View>
                <View style={AppStyles.containerHorizontal}>
                  <H2 text={t("model.user.your_data")} />
                  <View style={AppStyles.mla}>
                    <Button color={Colors.Primary} title={t("action.edit")} onPress={() => setIsUserEdit(true)} />
                  </View>
                </View>
                {user.address ? <Row cells={[t("model.user.address"), user.address]} /> : null}
                {user.firstName || user.lastName ? (<Row cells={[t("model.user.name"), `${user.firstName} ${user.lastName}`]} />) : null}
                {user.street || user.houseNumber ? (<Row cells={[t("model.user.home"), `${user.street} ${user.houseNumber}`]} />) : null}
                {user.zip ? <Row cells={[t("model.user.zip"), user.zip]} /> : null}
                {user.location ? <Row cells={[t("model.user.location"), user.location]} /> : null}
                {user.country ? <Row cells={[t("model.user.country"), user.country.name]} /> : null}
                {user.mail ? <Row cells={[t("model.user.mail"), user.mail]} /> : null}
                {user.phoneNumber ? <Row cells={[t("model.user.phone_number"), user.phoneNumber]} /> : null}
                {user.usedRef ? <Row cells={[t("model.user.used_ref"), user.usedRef]} /> : null}
                {/* TODO: KYC status, gebühr */}

                <SpacerV />
                {user.ref ? <Row cells={[t("model.user.ref"), user.ref]} /> : null}
              </View>
            )}

            <SpacerV height={50} />

            {(buyRoutes || sellRoutes) && (
              <RouteList
                buyRoutes={buyRoutes}
                setBuyRoutes={setBuyRoutes}
                sellRoutes={sellRoutes}
                setSellRoutes={setSellRoutes}
                user={user}
              />
            )}
          </>
        ) : null}
      </View>
    </>

    // TODO: remove change logo PNG
    // <View style={[AppStyles.container, styles.container]}>
    //   <Image
    //     style={styles.image}
    //     source={require("../assets/change_logo.png")}
    //   />
    //   <Text style={styles.text}>
    //     <Text style={{ color: colors.Primary }}>DEFI</Text>CHANGE
    //   </Text>
    //   <Text>{t('coming_soon')}</Text>
    // </View>
  );
};

export default withCredentials(HomeScreen);
