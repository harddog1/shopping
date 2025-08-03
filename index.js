function load() {
    let shopping_list = document.querySelector('.shopping_list');
    let a = JSON.parse(localStorage.getItem('shopping_list_array'));
    let total_price_value = 0;

    if (a != null) {
        for (let i = 0; i < a.length; i++) {
            let item = document.createElement('div');
            item.classList.add('item');

            let name = document.createElement('div');
            name.classList.add('name');
            name.textContent = a[i][0];

            let quantity = document.createElement('div');
            quantity.classList.add('quantity');
            quantity.textContent = a[i][1];

            let price = document.createElement('div');
            price.classList.add('price');
            price.textContent = a[i][2];

            item.appendChild(name);
            item.appendChild(quantity);
            item.appendChild(price);

            shopping_list.appendChild(item);
            total_price_value += (a[i][2] * a[i][1]);
            shopping_list_array.push([name.textContent, quantity.textContent, price.textContent]);
        }
    }
    
    total_price.textContent = total_price_value.toLocaleString('ko-KR');
}
function item_add() {
    let add = document.querySelector('.add');
    add.addEventListener('touchend', function() {
        let input_info = document.querySelectorAll('.input_info');

        if (input_info[0].value && input_info[1].value && input_info[2].value) {
            let item = document.createElement('div');
            item.classList.add('item');

            let name = document.createElement('div');
            name.classList.add('name');
            name.textContent = input_info[0].value;

            let price = document.createElement('div');
            price.classList.add('price');
            price.textContent = input_info[1].value;

            let quantity = document.createElement('div');
            quantity.classList.add('quantity');
            quantity.textContent = input_info[2].value;

            item.appendChild(name);
            item.appendChild(quantity);
            item.appendChild(price);

            let shopping_list = document.querySelector('.shopping_list');
            shopping_list.insertBefore(item, shopping_list.firstChild);

            let total_price_value = Number(total_price.textContent.replaceAll(',', ''));
            let name_value = input_info[0].value;
            let price_value = Number(input_info[1].value.replaceAll(',', ''));
            let quantity_value = Number(input_info[2].value.replaceAll(',', ''));

            total_price.textContent = total_price_value + (price_value * quantity_value);
            total_price.textContent = Number(total_price.textContent).toLocaleString('ko-KR');
            shopping_list_array.unshift([name_value, quantity_value, price_value]);
            localStorage.setItem('shopping_list_array', JSON.stringify(shopping_list_array));

            input_info[0].value = '';
            input_info[1].value = '';
            input_info[2].value = '1';
        }
    });
}
function item_update() {
    let touchmove = false;
    document.addEventListener('touchmove', function() {
        touchmove = true;
    })

    document.addEventListener('touchend', function(e) {
        let element = e.target;
        let item = e.target.parentNode;
        let shopping_list = document.querySelector('.shopping_list');
        let item_index = Array.from(shopping_list.children).indexOf(item);

        if (element.className == 'name' && element.children.length == 0 && touchmove == false) {
            let input = document.createElement('input');
            input.classList.add('update');
            input.setAttribute('type', 'text');

            let tmp_value = element.textContent;
            input.value = element.textContent;
            element.textContent = '';
            element.appendChild(input);

            input.focus();
            scroll_lock = false;
            input.addEventListener('blur', function() {
                if (input.value != '') {
                    element.textContent = input.value;
                    shopping_list_array[item_index][0] = element.textContent;
                    localStorage.setItem('shopping_list_array', JSON.stringify(shopping_list_array));
                }
                else element.textContent = tmp_value;
                scroll_lock = true;
            });
        }
        else if ((element.className == 'quantity' || element.className == 'price') && element.children.length == 0 && touchmove == false) {
            let input = document.createElement('input');
            input.classList.add('update');
            input.setAttribute('type', 'text');
            input.setAttribute('inputmode', 'numeric');
            
            let tmp_value = element.textContent;
            input.value = element.textContent;
            element.textContent = '';
            element.appendChild(input);

            input.focus();
            scroll_lock = false;
            input.addEventListener('keyup', comma);
            input.addEventListener('blur', function() {
                if (input.value != '') {
                    element.textContent = input.value;

                    let total_price_value = Number(total_price.textContent.replaceAll(',', ''));
                    let quantity_value = Number(item.children[1].textContent.replaceAll(',', ''));
                    let price_value = Number(item.children[2].textContent.replaceAll(',', ''));
                    let pre_price = shopping_list_array[item_index][2] * shopping_list_array[item_index][1];
                    let curr_price = price_value * quantity_value;

                    total_price.textContent = total_price_value - (pre_price - curr_price);
                    total_price.textContent = Number(total_price.textContent).toLocaleString('ko-KR');
                    shopping_list_array[item_index][1] = quantity_value;
                    shopping_list_array[item_index][2] = price_value;
                    localStorage.setItem('shopping_list_array', JSON.stringify(shopping_list_array));
                }
                else element.textContent = tmp_value;
                scroll_lock = true;
            });
        }
        touchmove = false;
    });
}
function item_remove() {
    let start_x;
    document.addEventListener('touchstart', function(e) {
        start_x = e.touches[0].clientX;
    });
    document.addEventListener('touchmove', function(e) {
        let shopping_list = document.querySelector('.shopping_list');
        let item;

        switch(e.target.className) {
            case ('item'):
                item = e.target;
                break;
            case ('quantity'):
            case ('price'):
                item = e.target.parentNode;
                break;
            default:
                return;
        }
        let curr_x = e.touches[0].clientX;
        
        if (start_x - curr_x >= 0) {
            item.style.transform = 'translateX(' + -(start_x - curr_x) + 'px)';
            item.style.transition = 'none';
        }
        if (start_x - curr_x >= 700) {
            shopping_list.style.overflow = 'hidden';
            let item_index = Array.from(shopping_list.children).indexOf(item);
            let total_price_value = Number(total_price.textContent.replaceAll(',', ''));
            let quantity_value = shopping_list_array[item_index][1];
            let price_value = shopping_list_array[item_index][2];

            total_price.textContent = total_price_value - (price_value * quantity_value);
            total_price.textContent = Number(total_price.textContent).toLocaleString('ko-KR');
            shopping_list_array.splice(item_index, 1);
            localStorage.setItem('shopping_list_array', JSON.stringify(shopping_list_array));
            item.remove();
        }
        document.addEventListener('touchend', function() {
            item.style.transform = 'translateX(0px)';
            item.style.transition = '0.5s';
            shopping_list.style.overflow = 'auto';
        });
    })
}
function comma(e) {
    let value = e.target.value;
    if (value == '') return;
    value = Number(value.replaceAll(',', ''));
    if (isNaN(value)) e.target.value = '';
    else e.target.value = value.toLocaleString('ko-KR');
}

let shopping_list_array = [];

let scroll_lock = true;
document.addEventListener('scroll', function() {
    if (scroll_lock) self.scrollTo(0, 0);
});

let total_price = document.querySelector('.total_price');
total_price.addEventListener('click', function() {
    // location.reload();
    // localStorage.clear();
});
total_price.textContent = 0;

let input_price = document.querySelectorAll('.input_info')[1];
input_price.addEventListener('keyup', comma);

let quantity = document.querySelectorAll('.input_info')[2];
quantity.addEventListener('keyup', comma);
quantity.value = 1;

load();
item_add();
item_update();
item_remove();