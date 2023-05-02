import numpy as np
import pandas as pd
#This is the fake database
from faker import Faker
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

fake = Faker()

class Resturant:
    def __init__(self,name,rate,amount_ratings,w) :
        self.name=name
        self.rate=rate
        self.amount_ratings = amount_ratings
        self.w=w


class User:
    def __init__(self,name,resturant_name,rate):
        self.name=name
        self.resturant_name=resturant_name
        self.rate =rate
# to generate a list of resturants with resturant names and their ratings 
resturant_list =[]


for i in range (50):
    resturant_name = "Resturant" + str(i)
    rate = fake.random_number(digits = 1)
    amount = fake.random_int(0,200)
    resturant_list.append(Resturant(resturant_name,rate,amount,0))
    
def print_res(resturant_list):
    for i in range(len(resturant_list)) :
        print(resturant_list[i].name+" has the rate "+str(resturant_list[i].rate)+ ". Total amount of ratings: " +str(resturant_list[i].amount_ratings))

# to generate a list of users with user names, the last shopped resturant and the rate to the resturant

resturant_range= len(resturant_list)-1


#make a namelist for users
namelist=[]
for i in range(10):
    name=fake.name()
    namelist.append(name)

use_res_rate=[]

user_range = len(namelist)-1
'''
for i in range(100):
    u = fake.random_int(0,user_range)
    r = fake.random_int(0,resturant_range)
    mrate = fake.random_number(digits = 1)
    a=namelist[u]
    b=resturant_list[r].name
    c=mrate
    use_res_rate.append(User(a,b,c))
    

def print_user(listlist):
    for i in range(len(listlist)-1) :
       print("Index "+str(i)+": "+listlist[i].name+"   "+ listlist[i].resturant_name+"  " +str(listlist[i].rate))

#print_user(use_res_rate)
'''
# This is the maschine learning part
#For non registered user
#to calculate the weight for each resturant。 This is for rec in home page, not specific user
sum=0
for i in range(0,resturant_range):
    sum = sum+resturant_list[i].rate
#print(sum)
C= sum/len(resturant_list)
m=1
#m is the minimum number req for ratings

for i in range (0,resturant_range):
    W= (resturant_list[i].rate * resturant_list[i].amount_ratings+C*m)/(resturant_list[i].amount_ratings+m)
    #R*v + C*m
    resturant_list[i].W= W
    #print(str(i)+": "+str(resturant_list[i].W))

#For registered user
# Create an empty DataFrame with column names
userdf = pd.DataFrame(columns=['name', 'resturant', 'rate'])

for i in range(100):
    u = fake.random_int(0,user_range)
    r = fake.random_int(0,5)
    mrate = fake.random_number(digits = 1)
    a=namelist[u]
    b=resturant_list[r].name
    c=mrate
    # Create a list of dictionaries representing new rows
    new_rows=new_rows = [{'name': a, 'resturant': b, 'rate': c}]
    # Create a new DataFrame with the new rows as a DataFrame
    new_df = pd.DataFrame(new_rows)
    # Concatenate the original DataFrame with the new DataFrame
    userdf = pd.concat([userdf, new_df], ignore_index=True)

#Print the updated DataFrame
print(userdf)

resdf= pd.DataFrame(columns=['resturant'])

for i in range (50):
    resturant_name = "Resturant" + str(i)
    # Create a list of dictionaries representing new rows
    new_rows=new_rows = [{'resturant': resturant_name}]
    # Create a new DataFrame with the new rows as a DataFrame
    new_df = pd.DataFrame(new_rows)
    # Concatenate the original DataFrame with the new DataFrame
    resdf = pd.concat([resdf, new_df], ignore_index=True)
    print(resdf)

#merge two matrixes together
df=pd.merge(userdf,resdf,on="resturant")
print(df)


df_reshape= df.pivot_table(index='resturant',columns='name',values='rate').fillna(0)
print(df_reshape)

df_reshape_matrix= csr_matrix(df_reshape.values)
model_knn = NearestNeighbors(metric='cosine',algorithm='brute')
model_knn.fit(df_reshape_matrix)

df_reshape.shape
query_index = 4
#np.random.choice(df_reshape.shape[0])
#This line of code is using the numpy library to randomly select an index from a numpy array called df_reshape
print(query_index)
distances, indices = model_knn.kneighbors(df_reshape.iloc[query_index,:].values.reshape(1, -1), n_neighbors = 3)
for i in range(0, len(distances.flatten())):
    if i == 0:
        print('Recommendations for {0}:\n'.format(df_reshape.index[query_index]))
    else:
        print('{0}: {1}, with distance of {2}:'.format(i, df_reshape.index[indices.flatten()[i]], distances.flatten()[i]))

    
'''
#get access to the database
import requests

url = "http://localhost:5000/resturants"

payload={}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.json())
'''