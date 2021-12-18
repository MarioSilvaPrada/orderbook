/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

//  https://dev.to/muratcanyuksel/using-websockets-with-react-50pi
// https://blog.logrocket.com/how-to-implement-websockets-in-react-native/

import React, {useEffect, useState} from 'react';
import * as S from './App.style';

const enum Product {
  XBT = 'PI_XBTUSD',
  ETH = 'PI_ETHUSD',
}

const App = () => {
  const [product, setProduct] = useState<Product>(Product.XBT);

  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [topAskSize, setTopAskSize] = useState(0);
  const [topBidSize, setTopBidSize] = useState(0);
  let ws = new WebSocket('wss://www.cryptofacilities.com/ws/v1');

  useEffect(() => {
    const apiCall = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [product],
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(apiCall));
    };

    ws.onmessage = event => {
      const json = JSON.parse(event.data);
      const {asks, bids} = json;
      if (bids?.length > 0) {
        let totalBidSize = 0;
        const newBids = [];

        for (const bid of bids) {
          if (bid) {
            const size = bid[1];
            if (size > 0) {
              bid.push(size + totalBidSize);
              newBids.push(bid);
              totalBidSize += size;
            }
          }
        }
        setBids(newBids);
        setTopBidSize(totalBidSize);
      }
      if (asks?.length > 0) {
        let totalAskSize = 0;
        const newAsks = [];

        for (const ask of asks) {
          if (ask) {
            const size = ask[1];
            if (size > 0) {
              ask.push(size + totalAskSize);
              newAsks.push(ask);
              totalAskSize += size;
            }
          }
        }
        setAsks(newAsks);
        setTopAskSize(totalAskSize);
      }
    };
    ws.onerror = e => {
      console.log({e});
    };
    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }, []);

  const onTogglePress = () => {
    if (product === Product.XBT) {
      setProduct(Product.ETH);
      return;
    }
    setProduct(Product.XBT);
  };

  const onKillPress = () => {
    ws.close();
  };

  return (
    <S.StyledSafeArea>
      <S.Container>
        <S.Header>
          <S.HeaderText>Orderbook</S.HeaderText>
          <S.DropDownWrapper>
            <S.DropDownText>Group 0.5</S.DropDownText>
          </S.DropDownWrapper>
        </S.Header>
        <S.SubHeader>
          <S.SubHeaderText>Price</S.SubHeaderText>
          <S.SubHeaderText>Size</S.SubHeaderText>
          <S.SubHeaderText>Total</S.SubHeaderText>
        </S.SubHeader>
        <S.PriceContainer isAsk>
          {asks?.map(ask => {
            const price = ask[0];
            const size = ask[1];
            const total = ask[2];
            const totalLevel =
              topAskSize > topBidSize ? topAskSize : topBidSize;
            const sizePercentage = Math.round((total / totalLevel) * 100);

            return (
              <S.PriceRow key={price}>
                <S.Bar color="red" width={`${sizePercentage}%`} />
                <S.StyledText>{price}</S.StyledText>
                <S.StyledText>{size}</S.StyledText>
                <S.StyledText>{total}</S.StyledText>
              </S.PriceRow>
            );
          })}
        </S.PriceContainer>
        <S.PriceContainer>
          {bids?.map(bid => {
            const price = bid[0];
            const size = bid[1];
            const total = bid[2];
            const totalLevel =
              topAskSize > topBidSize ? topAskSize : topBidSize;
            const sizePercentage = Math.round((total / totalLevel) * 100);

            return (
              <S.PriceRow key={price}>
                <S.Bar width={`${sizePercentage}%`} />
                <S.StyledText>{price}</S.StyledText>
                <S.StyledText>{size}</S.StyledText>
                <S.StyledText>{total}</S.StyledText>
              </S.PriceRow>
            );
          })}
        </S.PriceContainer>
        <S.ButtonsWrapper>
          <S.Button onPress={onTogglePress}>
            <S.Label>Toggle feed</S.Label>
          </S.Button>
          <S.Button color="#F90716" onPress={onKillPress}>
            <S.Label>Kill feed</S.Label>
          </S.Button>
        </S.ButtonsWrapper>
      </S.Container>
    </S.StyledSafeArea>
  );
};

export default App;
