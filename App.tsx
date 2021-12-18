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

const App = () => {
  const [topBid, setTopBid] = useState(0);
  const [topAsk, setTopAsk] = useState(0);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    let ws = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
    const apiCall = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: ['PI_XBTUSD'],
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(apiCall));
    };

    // ws.onmessage = event => {
    //   const json = JSON.parse(event.data);
    //   const {asks, bids} = json;
    //   if (bids?.length > 0) {
    //     const bidLength = bids.length;
    //     const lastBid = bids[bidLength - 1][0];
    //     if (lastBid > topBid) {
    //       setTopBid(lastBid);
    //     }
    //     // console.log(bids);
    //     setBids(bids);
    //   }
    //   // if (asks?.length > 0) {
    //   //   console.log(asks);
    //   //   setAsks(asks);
    //   // }
    // };
    ws.onerror = e => {
      console.log({e});
    };
    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }, []);

  let currentSize = 0;

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
        <S.PriceContainer>
          {bids?.map((bid, index) => {
            const price = bid[0];
            const size = bid[1];
            let totalSize = size + currentSize;
            currentSize += size;

            if (size !== 0) {
              return (
                <S.PriceRow>
                  <S.Bar width={'60%'} />
                  <S.StyledText>{price}</S.StyledText>
                  <S.StyledText>{size}</S.StyledText>
                  <S.StyledText>{totalSize}</S.StyledText>
                </S.PriceRow>
              );
            }
          })}
        </S.PriceContainer>
      </S.Container>
    </S.StyledSafeArea>
  );
};

export default App;
