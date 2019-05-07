import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  order: any;
  orderCost: number;
  searchText: string;
  minExpDate: any;
  matIcon: string = null;
  creditCardImg: string = null;
  submitted: boolean = false;
  user: any;
  myCart: any;
  success: boolean = false;
  orderGeneration: string = null;
  totalAmountOfOrders: number;
  allOrderDates: any = [];
  allDupedDates: any = [];
  minDeliveryDate: any;
  cardType: string;
  finishedOrder: any;
  loadingComplete: boolean = false;
  hideImgOnOrder: boolean = false

  constructor(private shopService: ShopService, private router: Router) { }


  creditCardValidation(): void {
    let isMasterCard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
    let isVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    let isAmericanExpress = /^3[47][0-9]{13}$/;
    let isDinersOrDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
    let isIsraCard = /(3640|4580)-?([0-9]{4}-?){3}/;
    let isJcb = /^(?:2131|1800|35\d{3})\d{11}$/;
    let isUnionPay = /^(62[0-9]{14,17})$/;

    this.matIcon = "close";

    if (isMasterCard.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/masterCard.png"
      this.cardType = "Master Card"
    }
    else if (isVisa.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/visa.png"
      this.cardType = "Visa"
    }
    else if (isAmericanExpress.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/americanExpress.png"
      this.cardType = "American Express"
    }
    else if (isDinersOrDiscover.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/diners.png"
      this.cardType = "Diners"
    }
    else if (isIsraCard.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/israCard.png"
      this.cardType = "Isracard"
    }
    else if (isJcb.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/jcb.png"
      this.cardType = "JCB"
    }
    else if (isUnionPay.test(this.orderDetails.controls.creditCard.value)) {
      this.matIcon = "check";
      document.getElementById("matIcon").style.color = "green";
      document.getElementById("matIcon").style.left = "135px";
      this.creditCardImg = "../../../assets/images/unionPay.png"
      this.cardType = "Union Pay"
    }
    else {
      if (document.getElementById("matIcon")) {
        document.getElementById("matIcon").style.color = "red";
        document.getElementById("matIcon").style.left = "167px";
      }
      this.matIcon = "close";
      this.creditCardImg = null;
    }
  }

  cvvLength(ev: string): void {
    if (ev.length > 3) {
      this.orderDetails.controls.cvv.setValue(ev.substr(0, 3));
    }
  }



  return(): void {
    (document.getElementsByTagName("body") as HTMLCollectionOf<HTMLBodyElement>)[0].style.overflowY = "auto";
    this.router.navigate(['home']);
  }



  orderDetails: FormGroup = new FormGroup({

    city: new FormControl(null, [Validators.required]),
    street: new FormControl(null, [Validators.required]),
    houseNumber: new FormControl(null, [Validators.required]),
    aptNumber: new FormControl(null, [Validators.required]),
    deliveryDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
    creditCard: new FormControl(null, [Validators.required]),
    expirationDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
    cvv: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(100)])

  });

  get f4(): any { return this.orderDetails.controls; }

  autofiller(ev: any): any {
    if (ev.target.placeholder == "City") {
      return this.orderDetails.controls.city.setValue(this.user.address.city);
    }
    else if (ev.target.placeholder == "Street") {
      return this.orderDetails.controls.street.setValue(this.user.address.street);
    }
    else if (ev.target.placeholder == "House Num") {
      return this.orderDetails.controls.houseNumber.setValue(this.user.address.houseNum);
    }
    else if (ev.target.placeholder == "Apt.") {
      return this.orderDetails.controls.aptNumber.setValue(this.user.address.apt);
    }
  }

  orderAction(): void {
    this.hideImgOnOrder = true;
    this.loadingComplete = false;
    this.submitted = true;
    if (this.f4.deliveryDate.value && this.f4.expirationDate.value && this.orderDetails.valid && this.matIcon === "check") {
      (document.getElementsByTagName("body") as HTMLCollectionOf<HTMLBodyElement>)[0].style.overflowY = "hidden";
      this.shopService.CreateNewOrder({ orderDetails: this.f4, orderCost: this.orderCost, user: this.user, myCart: this.myCart })
        .subscribe(data => {
          this.finishedOrder = data
          if (data.cartID) {
            this.orderGeneration = data.generated
            this.shopService.lockCartProd({ cartID: data.cartID, generated: data.generated }).subscribe(data => {
              this.shopService.lockCart({ userID: this.user._id, generated: this.orderGeneration }).subscribe(data2 => {
                this.success = true;
                this.loadingComplete = true;
                this.hideImgOnOrder = false;
              })
            })
          }
        });
    }
    else this.loadingComplete = true;
  }

  computeOrderDeliveryOverload(): void {
    this.shopService.getOrders().subscribe(data => {
      this.totalAmountOfOrders = data.length
      if (this.totalAmountOfOrders > 0) {
        this.allOrderDates = data.map(item => (item.scheduled.split(":")[0].substr(0, 15))).sort().reverse()
        var i: number = 0

        while (i < this.totalAmountOfOrders) {
          var duplicatedDateInstance = this.allOrderDates.filter(item => item == this.allOrderDates.filter(item => item)[i])

          if (duplicatedDateInstance.length > 2) {
            this.allDupedDates.push(duplicatedDateInstance[0])
            i += duplicatedDateInstance.length
            if (i >= this.totalAmountOfOrders - 1) {

              this.loadingComplete = true
            }
          }
          else { i++ }
        }
        this.allDupedDates = this.allDupedDates.map((item) => new Date(item).getTime());
      }
    });
  }

  myFilter = (d: Date): boolean => {
    const day: any = d.getDay();
    return (!this.allDupedDates.includes(d.valueOf())) && day !== 6;
  }

  downloadPDF(): void {

    var order: any = this.order;
    var orderCost: number = this.orderCost;
    var cardType: string = this.cardType;
    var user: any = this.user;
    var userForm: any = this.f4;
    var finishedOrder: any = this.finishedOrder

    var generateData = function (amount): any[] {
      var result: any[] = [];
      var data: any =
      {
        Item: "",
        Amount: "",
        Unit_price: "",
        Summed_price: "",

      };
      for (var i: number = 0; i < order.length; i += 1) {
        data.Item = order[i][1].title;
        data.Amount = order[i][0].amount.toString();
        data.Unit_price = "$" + order[i][1].price.toString();
        data.Summed_price = "$" + order[i][0].totalPrice.toString();
        result.push(Object.assign({}, data));
      }
      return result;
    };

    function createHeaders(keys: any): any[] {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          'Item': keys[i],
          'name': keys[i],
          'prompt': keys[i],
          'width': 60,
          'align': 'center',
          'padding': 0

        });
      }
      return result;
    }

    var generateData2 = function (amount: number): any[] {
      var result: any[] = [];
      var datenow: Date = new Date();
      var today: string = datenow.toString().split(":")[0].substr(0, 15);
      var data: any =
      {
        id: user._id,
        Date: today,
        Card_number: userForm.creditCard.value.toString(),
        Card_type: cardType,
        Order_price: "$" + orderCost
      };
      for (var i: number = 0; i < amount; i += 1) {

        data.id = (i + 1).toString();
        result.push(Object.assign({}, data));
      }
      return result;
    };

    function createHeaders2(keys): any[] {
      var result: any[] = [];
      for (var i: number = 0; i < keys.length; i += 1) {
        result.push({
          'id': keys[i],
          'name': keys[i],
          'prompt': keys[i],
          'width': 65,
          'align': 'center',
          'padding': 0
        });
      }
      return result;
    }
    var generateData3 = function (amount): any[] {
      var result: any[] = [];
      var data: any =
      {
        id: user._id,
        First_name: user.firstName,
        Last_name: user.lastName,
        Purchase_order_num: finishedOrder._id,
        Receipt_reference_num: finishedOrder.cartID,

      };
      for (var i = 0; i < amount; i += 1) {

        data.id = (i + 1).toString();
        result.push(Object.assign({}, data));
      }
      return result;
    };

    function createHeaders3(keys): any[] {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          'id': keys[i],
          'name': keys[i],
          'prompt': keys[i],
          'width': 65,
          'align': 'center',
          'padding': 0
        });
      }
      return result;
    }

    var headers: any = createHeaders(["Item", "Amount", "Unit_price", "Summed_price",]);
    var headers2: any = createHeaders2(["Date", "Card_number", "Card_type", "Order_price"]);
    var headers3: any = createHeaders3(["First_name", "Last_name", "Purchase_order_num", "Receipt_reference_num"]);

    var doc: jsPDF = new jsPDF({ putOnlyUsedFonts: true, orientation: 'portrait' });
    doc.setFont("times");
    doc.setFontStyle("normal");
    doc.addImage('data:image/png;base64,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', 'JPEG', 0, 5, 250, 15);
    doc.text('Receipt for - ' + user.firstName + " " + user.lastName, 105, 32, null, null, 'center');
    doc.line(75, 33, 136, 33);
    doc.table(17, 40, generateData(100), headers, { autoSize: false });
    let finalY = doc.lastCellPos.y + doc.lastCellPos.h;
    doc.text('Total VAT liability:', 20, finalY + 30);
    doc.text("$" + (orderCost - (orderCost * 0.17)).toFixed(2).toString(), 55, finalY + 30);
    doc.text('Plus VAT of 17%:', 20, finalY + 40);
    doc.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAYAAABxyNlsAAAgAElEQVR4XtVdB1iV1Rt/L3DZCMgF2RtkCigbt+YqcRUuLMtSG39HWmrmSittWVlmuTVHlivcG0X2FtlLZMiQveFy/8/v0He94EWGonWeh+ze7/vO+H3vec+7L49eYBOJRLzQ0NCNRLRUTk5OWU1NjZSVlUlBQYHuXQggi5fGk5pAm/h8PoX/+DXpu3uToacPiUQiyr55jVSMTEmmjzq1tLRQXV0d1dTU4O9Gc3Pzj/Ly8hddXV1rX+DyiPciBgeoERERswQCgX+fPn1Gq6qoyAWtW0E6Ti7kOGsuA+/aqqWk7+ZJttNmsCkycN28yNBrMPt8bdWHpG5iSoMWLmKfb6xdQRqmZuT81kIA3FxVVRVbUVHxd2lp6REvL68MHo8net5rfa7gikQimZycnFFqampzo7ZsmCGwtZdxfuMdtuacW9dJ28GJlDT7ss9NdXXEV1LqEI/G6mqSV1UVX08/H8BehrJAm72cm+tXUT8nF+o/xa+uqKjoen5+/q8tLS3nXV1dm54XyM8FXJFIJJuamupLGcnrrcf72hIRPz8yjGQVFKifo3OvrDXj4lnSdXElFZ1+VF9RTkl//t5o9vK0wIe1tQE1NTV/ODk5FfXKwBKd9iq4CQkJTqamptNVVFTGxB/cPbCppobHbePeXphk/y3NzRSz+xfS6m9LpsNHi4RCYWZeXt7vxcXFP7m6upb01lx6Bdy0tDQFJSWlmQlfffabzyfr+ar99Hpr/j3q917gVcoJChR5LF+dUVhUtC8vL++Ql5dXdo86e8JDzxTc6OhobV1dXX9dXd15ZRlpdgWRYTz7GXOees7V1dVMYoAU0dDQwP59mlb9oIAKosLIdMQY4isrixobG1PT09PX2Nvb//k0/bZ/9pmBm5CQ4FYXdO2Emq6eYf9Jr3Z5jjh8IEo1NjaSkpQDbNeunbRjxw5au3YtO6h+/PEH2rz5K3J1dWVj4Ll79+5RSkoKOTjYk5mZ+RPHRh88Xttl3968gYyHjGiWMbX4ubS0dMOAAQPKuryA3qTc6OhofV1d3YV6enqLsq9fVhc2NpLF2Je7NDcsVCgUUkZGOt27l0NZWZk0YcLLZGRk1Ob511+fQ4aGBvTBB4to8eJFtHLlKho4cCADqampiZKSkujAgf3U0iKkefPeocbGBhIKW8QvAJ1hLOyA8+fP0+TJk0leXl48RtrZU6TQRx0AQ16OysjIWOXo6Hi5S4voLXDBWyuCA8PMvAY79bXq36O5nD17hvLy8sjGxpZiY2NJXp5Pr7/+BlMmuDZ37htkYWFBK1asZCCBRcjIyLDL+Jyfn0/nzp1lgOHlhIWFMaB9fSeJ+8BLQP8hISHk5uZK7u4eJCsr+9icc4NvUUNNdTXPov8ac3PzH3k8XkuPFkbUcyUC/NXS1GT/zVVLx3ss/pgEtvZS54DFo4FCa2trSU5OTgzcw4cPGcUZGBiQtXV/unnzJqPiJUuWtNneoNwJEyaQn990MaiSgwHcwMAbDHR7e3uqrq4hHR0dMjExYbeVlJSQnKws1dS2KmxaWn1JQUHxMfaAa2lnT1NdaQkNmDNPlJubu7OysnKZvb19dU8A7hHPjYmJ8bG3t/+ez+e3Mr4ntObmZiouLqLbt29Tfn4BjRnzEqNStpC0NDpzJoCB7uzsTH379iVNTU0yNjZpQ7n+/rPojTfepNGjR0sFpKqqilEuQHZyciJ9fX0yNDQi1X+UDPDkDRvW0cSJvjRq1Gjq06dPZ9MWXy8rKztcUVExz8zMrL7LD/1zY7fBTUlJEeQf2l3gOPtNOS1rG3agtN+q3CTwfUpKMgNWT0+PVFRUqV8/Herf34aBhEVfuXKZHjx4QEOGDCUXFxd2uCkoyJOiYqt2duDAAfpqy2Yyt7Cg1as/JQ8PD6lr3L17FyUmJtKkSZMZwAAQY6A/gL5p0yYaN24sjRgxktTV1buEU9bVi1RbXCTSH/vKwYKCgnfs7e0bu/RgT8DNysrS0NPU/Cv+4K5RFuMmkrqZBRUVFVJkZBSJRC1teBz6r6+vo7i4OMYSSkoesiHBC+3s7MnU1JSJVdHR0RQSEszAsLOzI7AKLS0tGj58hJid4HmABJ7K8dr2i7x8+TIVFj5gz4HNcBJBeVkZXbp8ie2S6dNnkJmZGbuGQw/sA7sFn9tLEOg/9cxJMHWynjiVSktLf8jKyvqoO+pzlyk3KirK0tHR8Vc+nz+SWxgOCRweN28GUmZmBs2e7U9eXl5iqsN2BdWcPHmCkpOTGYDNzU3k6elNQ4cOJWNjY2bNAnXfuXOHDAwMGZ+0srLqDoGwnVNfXy9+AeC9XMP8bt8OIltbW/L29mHSRW5uLhuvrq6WHWwYD2JgRy+O66uoqOhnHR2dRV095LoEbkxMjIYoNiJcy9LKynjwcPHEwStBaRUVFZSamsIOo0GDXNkWxwKx6IaGenrwoJBRRllZGQMvNDSE/QsKRuNEMvQH6lRUVOwWuB3dfO3aVQoICGDgjR07jo1548YNCgq6RcXFxbR48RIKDr7N5uHu7v7EMWP37yQ1fcMmfn/7NcbGxt/weDxhZ5PsFFwYXcrLy3cUBV1/W0ZGliwn+LbpkwMG2xsUkpmZSfPmvc0OKK7FxsYwfoh7VVRUyNramvFdaaJQZxPuzvXysnLau28PG3vjRpiNiS5fvkK5ufdpzJixpKSkSOfOnWMv03/2HNLQ1Oiw+/Rzf5OMnByZvTS+NDk5+XU7O7uzT5rLsWPHZDsFNzc3d7WBgQFmJvVeSANRUVGMektKiikjI4OJW5AxwUNBseB3V69eYZKAm5s7O9ygwkrbhrmhtykv9DYVJcRRWXoKVeXlUkNlBQkbG0hGjk+K6hqkoqdHylo6pKzTj5kVwRPVjU07XCsOXfD6jIxMgsY3btw4trtwkIK6vb29yda2da5daY2NjUnx8fF+bm5uCR3dv379erkn9gbtqzHwSrbHko8eMTGJ3nDI5OTk0K1bt8jR0YGsrKzpzp149rmyspKmTJnCxCpQK3irsrKSmB9LTirz8nlK+usIpQWcpKa6mq6s77F7FDU0yWriNPJYuoI0zSweu465QlnZsmUzU1Kg4aGBrfXr1098P+7r6IDDTWVZGZRx/m+RwcSpF/KLSma6urpWSJswdnyH4MbFxakYaqofjNuxbQomDCO0tIbJrV27hkaNGkXjxo1nVHvx4kW6desm47GrVn3CJIP2VCpqaaHo336iiG3fUlX+fXHXfLU+ZDJkJKNIbXtHMvAczKgVWxKmQ1BxdUE+lWdnUPHdO1QQFU7Z1y5RS/M/NnAej8xfmkCjv972GDVDegGLgB3CyMiYbGxsSENDg80ZEgnk8eLiEqqsrCA1tVbpBdckG3ZW8d14cpn3bsu9e/fWiUSib6TJwE8Et6Agb4Ourv7azsgIfiscUKGhoTRggBONHDmSncbx8fHMHoDvQLmSLfvGFTozbybVlbaKZ3xVNRow523qP/lVMnD36mxIqdfvBwVS8sljFLfvNxK1tJ41jnPepmEbNou9G/gOO6iiopy9eD1dfVLXUGeUGh0dxVRjHMrm5hYMVB+fweww7OiAbWlpKYqOjp7u5uZ2o/2k1q9fryiVcqOjo72M+qheF1hYdWrbwxuHMnD58iV2mLm5ubFxBg0axEQrSQOJsKmJbm38lCK2fc3uUdM3You3mTajy/yuM+QxRvBXGyn0m03sVvDpoeu/JLf3P+zw0YKCfLbbcCgbGhrSkCFD2Jlw//59cnBwZHaN9q25oYEpGE1KypGpqalTvL2987h7QLVLly7VeQzcu3fvyjck3wkuDgocNPKL70hOilhUVFTEDghQAQ4nOTk+O9BgnXrwoIAsLa3I0tKSUSx3SDxMTaY/p42jqtwcNocha78gz6UrO8Oqx9drS4rpyseLKOXkH6wPeI6nHQ0gRU3NNn22WuUy6MsvP6dp014jc3MzpqZXVVVSUFAQLVmy9DErHTooTkygayuX0NhtvzbnVtX94OjouFyy4/DwcPvHwE1MTJxsqN7npEgopD5GxuL7IUbhD4rB9evX6O7du0y7wefJk6cw8QoCOv4kLVroIPPSOTo5ewrji3C1TD0aQBqmT7a79hjVdg/CynVi1iRqqCgnHHr+V8NI09yyzV2wlkVEhNOwYcOZahwWFkrBwcE0YMAAdo5gndIaANa2c4D2Vp+VleXi6uqazN0H3aANuHB5l5aWBvXt29dbWmeQAJKSEqm+voFMTIzo5s0guncvm71ZyI0wmLRvkALOzPdnaqSdnz9N+GUf8f4xFz4rADvrBwfg72O82a5RFuiQ/9VQ8WEHyi0vL2fUC3VcV1eX7Tao0hoamszK1pWWlJR02s7ObrLkvW3AjYmJmdwSHnRi4PwPpPJi8FQcXjCwQC6ERhUeHkaxsXHk4+PDvpc8XXFw/TVtPDtg3D5YTsM3ftWVefbKPTDi/zFpNOWFBpGiZl96IzCa7UxuRwLM1NRU0tTsy1RhqOZdcSdV5t6n3OCbpDt6vCgzM3OApOwrBhFUW1BQcDB+y4bZ7os/kiorYtXHjh2jGzeu0eTJU2nEiBHMKnb69Cl2gIHXclpX0Z1YOjjSg7ECz2WracinrRrSi2wQ/45OHMnAAHt642YMyUp4JMDSsB5IB9w6cK7ge3wneThz64D9tzQtmTyWrKCYmJiAgQMHilVYMbjwKlhYWEQSkUNHmgoGwQl6/vw5pjzAfgBNB/e7u7mL1UcEdOzxsKfK+9lk9cpUmnzwrxeJaZuxm2praf/QgVSWkUpmo8fTq38+rsVyNpH6unoqKobWmU59+2oxi5q2tnaHkg0O89zcvIFubm4xGFQMbnZ29hoTE5PPOkMB6i5Er+zsLMar8EYhrsDMx7GEcwvn0t0/DpDAzpHeuBlNMm3dKZuJqPfEhM4WQETl2Zm029WGWoTNNP7nveQw6w3xU5B6wPqgzTk6DqBLly4yQCHvgmXAVtwR8YHqY2Njx3l4eFwUgxscHOxNsRGX5XmkLC1ogzPOcEZxPAjmD60LB4KknRV89s8pY5h8OS8i6blJBV3AtM0tdw7vowvvv0UK6hr0Tky6WNGA9LNv317GFiA9HDlymKnKsDHDhvLee+89psJDc4zbv5PUTcyoychsu42NzfsMXLCDysrKbzXLS95rrqvlWb3c5sBj/ObhwxLKy8tn1iSou9C64MbmvAXcrMHTdrnaUHlWeq/Lsd0FU9r9f/iOppxb18jl7feZuowGYoGmxufLMbZ35swZpgajAfiXXhrTxhiP7xG3Fn9gJznPe48elpdH6erqMvcXLywszEwgEOw2NzdvNf1LNAwENRHGbMi1BQUF7CqM3sOGDaOBAwe1uT/x2CE6u2AOqeoa0II7Wcwe8G9uFTnZ9JuTOcnIytH8+CxS0zdgB1ppaauNGu7+qKhIxh7ADiC/g4Kf1BoaGk4pKipOYeCGhoYus7S03KKuqior1y6SBeCmp6czyrWwsCQFeQXKyMxg2wNunZEjR7XxGuz1caKSxDs0btsucvR/69+Mq3huAW/PpuTjR2jQwiU08svv/jHwN7ADG8oFFAiwhY4UiTbE2NjIpI/s7GwlGHN4wcHBVbIxYargMYMW/O8xQAAk5FvIsLBu4dDKzs6mvLxcJutyg+aGBNGRCUNJqa8WvZ9W+NwVhZ6+yZLkRNrr5UB8FVU2b4StcuEAXbXvYmywxKAv1pHAzuGU3bQZrZQbExMj0igrJiWBttRwTvDY48ePU1xcLLMjQM1VVlYhbW0BOTu7iAXti0sWUvz+38h98Qoatv7Lnq71hTx3YLgrFcZF08Q9R8lmil+P5gBwk0/8QVa+02L5CgouDNyUlBQRAOuo4S1Ce7ly5QoTTyAhwCCDGADJsKOfrXSptqSI5gbFMTvsf6lFbt9K11cvo/5TppPvniNPO/VYHo/XCu79+/dFejo6bTQVab1DaoAbR1ZWTszUOS2mMDaaDoxwJVU9Q3o3sdXq9V9qlfdz6NcBpkwt/l/m04XrNtfVneIrK7eyhTt37ojqAi+xAwgW/560qF+30bWVi8l++us0Yce+nnTxwp/5xc6Yqgty6c3gOx2GZnU2Saj8GZfOldtMmeHU18Iih1dcWCjKv/A3DXj9bcbIOesQKNXUxFRsqX9Sx+ffn0cJh/fSiM+/Jdf3lnY2h3/l9VP+0yjt7EmasOMA2U/379Ec68vKKDckaLLVy76nGeXW1NSIOPsrAivGjx9Dzs4DWbQgfPldCf05NHYw5YcHk9+py2QybFSPJvaiH7q58VMK++4L8vpoDQ3+ZIN4OiA4nDWQ7ZHKJU2CQFSPgqIiMwXweDwNHo/HnJa8pqYmkayMDBOdAO7KlSto5cqVpKUlYBpKV9oOR1NmK50fl0Xqxq2Rhf+1Fn9gF11cPJ8cZs6l8dv3iKcPW8qePXsYofXv31+MCQcyvMVwcdnZ2ZKhoTHxWlpmySkosFORF/LdZpFI2Exey1czcBH4Nnv2bEIgx+HDh6msrJS5x/38/Jja294bik6+N+xDTTXVtDi3iuTbOSP/KyAjAPqU/1SyGO9LUw+fagMu4oMTE++SgqICqaqoMXsvdruqqgoLGszJyaVVq1aRs4MjhXyxdt/oLT+8ycDNjwwTyfD51G+ACwP3+PG/aOrUaewNwQ29csXH9PP27UzGhS0BXl24pCVtm9/0lWMa2/JS4TNzND7vl5J17RL9NW0cmQx7ifxOMaMWa6DcdevWUP/+tqSu3ofZWoAT94d4s+DbwfTpmrVMRU44tDfWZe78VlFMxKkjLCqxnlatWsnCkcBfoP7++usOevvtd9jbampqpJ9++onWrVvfJsb1Gy0+8zYsK2lqb1583hj1eLzMKxfo+GsTyHTkGHrt+IU24B49eoTFZSBiqBVwIcMGLAH/IsYYpgB4jmVkZLJ5PJ6ZGFwuCQPgujg7UVOzkPhysiTLl6OmhgZS66NOsnKyjCWUljyk0LDwNgfd9yYa1FRZSYuyy0ihi7GvPUahlx5MOf0X/T3X7zHjPih3+/btNGvWLBIIBFJHR5wGruFAa2lp2ScrK9vKFpJOHBM9TEkkn5XrGOUiZH7p0iXE58uzLSAUNlNjYxPb9jU1tbRt24+0f//+NubGnQOtmZlxXngS9TQ3opcw63K3iP65umIROc2dT2O27mhDuX5+r9LWrT8wv9qT7A1V+XlIJswetvbzVsp9kJggepgQR3avzWIkHhMTw/xhXOO4BufIQyQ4PL2S4UnHJo+he4FXaNofZ8h8zIQuL+jfdCMStaN2fE9D1nxOnh+uagOus4sTmZma0cyZM1lwtTQvNx5AQEr6udOk7+r1W0lj425eRUWFiMsRkJajJQkA51tqbyS/umIxRf+27T9hIO/ohXKG88m/n6D2DoPCwkImNWEHw2Clp/d4CIFEv49sC6WlpSKOUfeUkhIO76fz779JCOWfeoQpJ/+5tlVflZrramlhQg6pGRi2mT+3a7GzwRakiaPcA214Lgw3RedOke5AN9J3lZ7M0RlSnOGDr6RCi/Mq/3PiWEF0BP0+yoPUTcxpfmx6Z8vt8DpMjsWJCYeGrtnE9Gdmcqy+cYkcZs1tU7+guyPsdrdj/vv/ogp8c8MnFPb95ja+tO6uH/eDyPIiQk/ZTZveahVLSEgQdTVk50kDwgof8vVGsps+h17esb8nc3thz2y31qOa4kKaEXCdjAYPE88DHm7JbM0uTrCciIx4PF41HJQtbm5uLH6hO26N9gOV38uknS5WhLyJDzJLSKEbiXRdnHSv3JZx4QydmOlLfYxMaX5cBsOACyVAVubgwa3hpFxDNiYiIKUlcMMbwZOR2cfj8Vrl3JCQkCwTbYFJ+pH9PLg4nsaLcHz6RMq8dJY8l39KQ1Z3Gl/SK2B1t1POxTN80zcshhfAcnnChw79TkuXfsh8h2jQyOBeR6A3Akfg/YYXHNJWasAJqrx/j5zf+SCWLy/fqv6GhobO0dbW3tAYG2FmM3V6p3PDAMj+RsAwQt8lw0XzwoLp8LjBJKekTAviszoM9e90kOd0A+rinJw1iXkgICXwlZUZgDAxHjx4gIJu3SJPLy8yNzdnRisuXw3Uiyyg9PTWxEGwVQRDJ/15iGxfm00x8fGfiUSiE/D+Kmlqao6ysbH5u7NEawSlwbyGYDwkacDljKgU6NRcOzFzEmVcCPjX815sYWiWFfcyCUHeg95dIqZOeLsRGJKfn8cyRBsaGqlPHzUm3yJAxMnJmWUnIcpz/PjxpKv7qBJKaWnpO1paWrsY5eI/YWFhWi4uLldb6uqcpPFKJGrU1zVQwYN8On36NMt5gAUIicsAeejQYWLZrywznfb5OFFzfR29dvISaso8Jzrs3jDXVy+nyO3fUV9LG3orLKFNKACM33X1dSz4rq62lqKio1gyIJIVYT/AH9jDW2/NIwcHB7b2muIiUtHWAc8Wx9+x/0H4aGFhwY6UHdvm67l6kNXLrXUKwHvS0lLp0qXLbPvjMRgykNKJOAa8VXiFEenIpd/jufBt31Dg2o9ZJPe8iOR/HXvgLGA8ngz5XwsjXee2kUNYAxSG9kmIiDxCKD9MADo6/WjTps+Z9TBqx49UX15G3ivW1snIyIgLRYhRvnv37my10uLfNcwtWVgPGgw54D14a7DnIpUfIaQLFixkHuDW6wdZXBV4jyT//WPSS5Rz8yqp6OjSwsT7/xpTZGlaCu0fNohpY1xeBmc/AeFgTQBMsuE6rgFsxHHgQIP5FRny+A4FiTTMLKhZRS1ZIBC01juQ5LGhoaFWjo6OgcrKymIGgpCegIC/2Wnp5dUayY+3Bt6D75AbsWvXLtLR0aZPPllNLi6tpVHQ6spKaZ+PM/OoGngMphlnrr3w2DGkZu31dGAyrbXvqzRp/zExn0VsGOLhBAItFsQtqeJy6QqIHUMMBwBGHkj7cNL09PTLVlZWYx4DNzIyUlkgEJzRVlUZ0VBeRpoWVqw2IqxkSI6GvAfgENqOwhGBNwOZGXLE8JHMloniEcOHD2/jd0NqKUQdBItoOwygWedukXw7qugep+z53cgmOjJ+CMt90xvkQTPPBbJYDU6m3br1W0aRX3zxJcsEbZ+UiIBEiF+okQPp4NVXXyM1eXmWRosSiAjgi4mJ2evp6SkOkmsTth8eHr5Eq6rs28zzAbwhqzeSgoYGMlXo6tWrZG1txUSUw4cPsZzZV16ZyHgtEvkQFIwscEmpgYMBsVi/j/ZkPjZNi/4089wNVqXueTbw2BN+rzBiwC6a/vcVcRAMDmsU28C6IA0hg93ffw47qKVVi4KohrMImltxQhxF/PQdDd+whcqahSh/8Jmnp+e6xygXXwQHBxsYGxv/pdLc4Klh0prKhI5OnDhOhw4doqqqCho3bgITnOG0BB+W1Oo4kyUmgMa9fejcR18ZQRU5WSxcE4knnOjTmyC3CIUUtGkNsxugGfoMo9f+Oi/OrcOhBT8hggphCM/KyqKtW79jZQ1gu4WvsL15VXK+SGJpqqkheXV1JAieamlp+dzDwwOpD215LvdFRETEJBcXlz9lZWWZXx0TiIyMZBHWqOUFsQvpRO2TL6CHY9uAd0GEgcAtmbAMITvgrZmUfq7Vs2o8ZCT57j/WJnX0WQIdf3A3Ba5bQfVlpQSpwOvjNczbwjUQAtIOTp06SSNGDCcTEzNGuTiwt2z5kiUuLlu2jPT1DcS1cjoyD9y/f3+rsbHxYymaj6VERUZGCrS0tA5rUMtLsNO6LfqIGkUixmtxViGyUZIf4RTFpOCkA/vAQQC1EN4MC3Nz0miXsYgtena+P1s0mqP/PEL2UF/LjoMBuwN6XngIC6oriAxlj/W1sqFJB/4igU1rdDjXsLuQjopoecwXlIsGNpGQcJc5Zqurq2j27DnsGqQjEBWTGFKS6M7ve2nYZ1sgRRTHxcWN5ZJMJMd4DFyUYQ0LC/PTLH94qLG0RMZh5uuM6QNEUCdX8YijaqiCyJvdufM38vdHGRZvlgkeExPNAimkWe1rH5bQ5aXvUuqZEyz5D03HwZmsfaeSrd8s4lhSV0FF5jqqjsbv30k1RQ/YY4gTHvnl92TnN7vDblAk7tNPV9Prr89lhzFnoME6QdXffPM1YxVIpvnww2ViHxqqmsbu2UH2fv4NhXX1v5SVlX3n7u7+KPW+I7aA7yMjI/nKysp7bG1tpQZNgQ+j1VRX0+Ejh1lBCD+/GawoRE1NNasVpq6uQb6+viwivaPIHSTI3f5yPSUe+/1RSj+y2FVUSdfFjVGbgYc3SwpBbEVLUxMrCVBTWEDlWZlUnHiH8sOCWVYO15D26vLO+zRo4eInBmCDYFB/B+wO6QgTJ05kqjy39SHvoj7OkSNHaPToUTRlytT2SoWorKwsKykpaZKPj4/UohYd1luIjIw0NjIyOqqtre2VdeUCCWwdqI+hEStSgQMAlY2QIxsYGMiqgowdO5alFKEqCMqxwImH7YbvOms4GBL/PMQKpqF2grCheyW8UFLAbORYsp44pdsZ8BcvXqATJ04wyQBJi9h5YAFckSFIQ9zBhh3SVFvDyhI2NzeL4uPjPxs4cOCGjqpKP7FSSEhIiK2VocGBy+/OdR3z3XbmNgd7QErq3r172dZfu3Y9q8gkCSLEt67kEHQE+oPYKCqKj6HS9DSqLshjqiVeAORS1FxU1dUnJS0tUumnSzoDXJ6qwDEoGDtv8+bNLGoeMjuqOCEzHxlLUIy4Bisacj48l32CupMRxcUl/h4eHqkdraPToi6oHSAUCjN4IpEJq9bRgviFGoKtE15RhD7BUtTbxYA6o/6nvY7EmsjICLY2HNA4kLHzJA3lzfX1EONEpaWlOSkpKQu8vb0fxT21m8D69etlOgUXz6Slpb1naWn508PUZB5KBWjZ2FFFeQXFxsUwsQup88+jpfx9nPr7Tuu1oQAqREyInzgnwO6+odkAAAVOSURBVH8bKiupND2FJSvikKyurm5MSkr6xM3N7bvOisx3Cdzw8HBdAwODXxqS7kzOvn6FRmz6mk0AKl9HVZaeNQJQCH51MKW5wXG9JhtLmzOKYsBG/fJvB0lZ37AuISHhsJKS0ntdKT3YJXAx6O3btx0sLS2PaygpWb8I+wBq2BydOILG/byH/dzB82p4qWAHPD5fmJySElFVVfWhj49PSFfG7zK46CwsLOwNc3PzrQKBQBM5vmARZqPGdmWcp76Hi+oxH/sKTTsKp0nvNQCKGARt+wGsEohQKBQlJiZGVldXr/X29n4UAtnJFLoFLmrmNjY2bra2tp5TFhnKR3qny7x3n/kqC+NjqLmuTtwvXDJIIOTatGNnmdQg2SAPP6uGsgFXPvofuS9aTppW/YVJSUnB1dXVmzw9PS91Z4xugYuOYfcViUTbzc3NR+noPCpA9I9buTtjd3hvSdJdCpg3g/BvZw0VnsAPjXwegd/ZM9KuS4mTQ6H4yuTk5MDa2tovvLy8wrrbb7fB5fivrKzsz/r6+kMMDQ1594NuUOrfJ8SZ392dhLT7URDjxqfLKXbPLx12Z/XyFBq7beczOeBqigrp7Pw5LG8Z5VkqKioq09LSflFTU/vcxsamqidr6hG4GAglsiorK39TVVUdrdlYp99QUswzHTX2mbtzUMP29JzHxa/hG78mtw+W9WTNUp8BuA+iI8jQeyjVNgtr0tLTNrq7u3/L4/Ee6dbdHK3H4HLjBAcHj1VQUFgM94aamposcrEitm8l5zcXiH1x3ZxTm9u57Mz2ffjuO0bd+ckEaXNAWSzIsMjBQxMKhbU5OTlxDx482ODl5XWlK2Vcn7S2pwYXnQcHB1vKyMis0tPT8zU0NNS6e/QAD5atp+WD6JvLD2u/CJtpM2nirkPdfm+SvBUSAU9Wlr2kkpKSuuzs7B+bmpp2eXt79zzUUWJGzwRc9BcfH69ZU1PjKScn97GxsfEw7rCDMQZpAZLR2t1BZJerLdU9LKKx23aR9StTkKHICmbAAfpBWqHUin0d9Y+KHldXLmFSAOqtw9HS3NxcmJ+fH1VQULC9paXllre39yMxpTsTlXLvMwOX6zskJMSUx+N9JS8vP9XExERWpqqcCiLDWY1bGF4AysPkRPHvmj1p/qg4d+WjD+jlXw8yixzXwHouLllA+Gkay/ETnwgBfgpMd6A7y49D4EZawAlyenMBbNQt+fn5t/Pz87cqKSndeFa/aiI5mWcOLjqHsSc0NHQ3EU0WCAR9BFoCHldVOejL9SwO2P1/raUPGyoqqKmullQlQoK4CcJjC0tcR+4V8ON+zo+sVngOFrV+Tq0ufoiH+BE6fVd36j/5NdZtY2OjKD8/v7qoqOgPoVC408vLK6IzG0FPCbhXwJWgYhQ4h9NssaKi4mkXF5fysqz0yeom5nuRI0tE6VdXffg/LUuLfs7z3l9IRJ74nTQtKxtxyhVc4TCYcA26vmQtX6jF2o5O4oz7Sx++R32trMn1n9gvqK4wV1Y3NTEPdVlZWTWPxzvL5/Pf6u2fUexVcDt64+np6ToaGhpaAoEgSfIekUg0/MLi+Qt0Xdz0nOe+4yQSiTSurFicrWluec914SIkFZteXv5+rJqhUYXnkpWoZqR3ffVyJ0WBVrbX0lVIZjbBTqgrK7mnYWohU11d3YKYrgcPHgxraGiAPwnAbpV0f/eUKrvy3AsBtysT+4e9vMnj8fZy94tEInMej5fZ1ee5+0JDQ/GTJvtFItE5Ho93w9PTM627ffTk/n81uFlZWYo9+dkWaUCg5CrYUk9A6ukz/weM1E2v1WK8wAAAAABJRU5ErkJggg==', 'JPEG', 83, finalY + 47 - 35, 35, 35, 40, 4, -40);
    doc.addImage('data:image/png;base64,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zoNAN+jB07h9obzjhi4i8PARaLeKgKAq0rHHJXk2gu36phFSA4fj0Hn4CFCPhjIBP54EpmSAeHAR5ruek//IKiXlqQwR+MUIYPJJ8D72KdgzEz2bXZJ4CVSR1l+ss/RiIqCUADhn/BiL3XD4MMhs7xc8bIoS+aZn+0g0qfS9VI4IPFACeXYDHu7JlhTlVPb2ogmxzlqTKFzDg40eaGeocSIwUAQOVjw9Adr6zgBHMwdqE1MpwJ7EZlhgtiwfO6pioN5L7RCBB04gWOoFl0q8ZFNJcnqEB94RegERGEgCj5qMH0B7TWOjux55t6OirAADpOAcmrb9ZfNxZqeLCAweAmiTRusICndn+7R8RjqY9zyiFPTIjcEzUuppxBFwSPIuGOYEkx7q1RZRvKYT+GuQ7CPkXCERB48G/PASuH37hA5mbcwvwvAGofaB46a18dAhiHmiiwgMYgLf7TpqMfFCIzhs/HZBDOvEsEE8fOo6ESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgQASJABIgAESACRIAIDACB/wcl5+GveTsy+gAAAABJRU5ErkJggg==', 'JPEG', 91, finalY + 47 - 15, 35, 35)
    doc.text("$" + (orderCost * 0.17).toFixed(2).toString(), 55, finalY + 40);
    doc.setFontStyle("bold");
    doc.text('Total Price:', 20, finalY + 55);
    doc.text("$" + orderCost.toString(), 55, finalY + 55);
    doc.line(20, finalY + 57, 70, finalY + 57);
    doc.text('Customer Details:', 10, finalY + 80);
    doc.setFontStyle("normal");
    doc.line(10, finalY + 81, 43, finalY + 81);
    doc.table(7, finalY + 85, generateData3(1), headers3, { autoSize: false });
    doc.table(7, finalY + 130, generateData2(1), headers2, { autoSize: false });

    doc.save("JB_Receipt.pdf")

  }


  ngOnInit(): void {
    this.order = this.shopService.order;
    this.orderCost = this.shopService.orderCost;
    this.user = this.shopService.user;
    this.myCart = this.shopService.cart;

    var someDate: Date = new Date();

    someDate.setDate(someDate.getDate() + 7);
    var dd: any = someDate.getDate();
    var mm: any = someDate.getMonth();
    var y: any = someDate.getFullYear();
    this.minExpDate = new Date(y, mm, dd);
    var minDeliveryDate: Date = new Date();
    minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
    var dd2: any = minDeliveryDate.getDate();
    var mm2: any = minDeliveryDate.getMonth();
    var y2: any = minDeliveryDate.getFullYear();
    this.minDeliveryDate = new Date(y2, mm2, dd2);
    this.computeOrderDeliveryOverload();

  }

}
