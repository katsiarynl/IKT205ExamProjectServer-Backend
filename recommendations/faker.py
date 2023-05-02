import requests
from faker import Faker
import random
fake = Faker()

'''
url = 'http://localhost:5000/postrestaurant'
myobj = {'restaurant': 'restaurantname', 'description': 'descriptiontest', "address": "addresstest",  "rating": 1, "photos": "gs://cooktogo-cec09.appspot.com/image1.jpeg",
          "category": "lol", "named": "dishn", "price": 22, "descrpt": "des1", 
           "named1": "dishn1", "price1": 100, "descrption1": "des11"  }

x = requests.post(url, json = myobj)

print(x.text)
'''
#address
#print(fake.address())

#commens
my_word_list = [
'danish','cheesecake','sugar',
'Lollipop','wafer','Gummies',
'sesame','Jelly','beans',
'pie','bar','Ice','oat','good','bad','beverage','milk',
'burger','beef' ,'Scandinavian style','Norwegian food','taste','fish',
'seafood','tofu','coffee','latte','vegan','bread','excellent','dinner','lunch',
'family friendly'
]

#print(fake.sentence(ext_word_list=my_word_list))


from faker_food import FoodProvider
fake.add_provider(FoodProvider)

#dish
#print (fake.dish())


#rest_name
#print(fake.ethnic_category()+" Resturant")


#pictures
list_pic= []
for i in range (1,41):
    pic_addr= "gs://cooktogo-cec09.appspot.com/"+str(i)+".jpg"
    list_pic.append(pic_addr)
    

#generate the fake data
for i in range(4):
    category=fake.ethnic_category()
    rest_name = category +" Resturant"
    description = fake.sentence(ext_word_list=my_word_list)
    address= fake.address()
    rating = fake.random_number(digits = 1)
    #for photo
    random_number = random.randint(0,len(list_pic)-1)
    photo= list_pic[random_number]
    dish1= fake.dish()
    price1=random.randint(50,700)
    dish2=fake.dish()
    price2=random.randint(100,700)
    description1= fake.sentence(ext_word_list=my_word_list)
    description2= fake.sentence(ext_word_list=my_word_list)
    #post the info
    url = 'http://localhost:5000/postrestaurant'
    
    myobj = {'restaurant': rest_name, 'description': description, "address": address,
               "rating": rating, "photos": photo,
          "category": category, "named": dish1, "price": price1, "descrpt": description1, 
           "named1": dish2, "price1": price2, "descrption1": description2 }
    x = requests.post(url, json = myobj)


