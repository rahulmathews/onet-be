import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

import config from '../config/config';
// import { UserModel } from '../../src/models/user.model';

const expect = chai.expect;
const base_url = config.BASE_URL;
console.log("Base Url: ", base_url);

describe('Register User', function(){
    // this.timeout(10000);

    // beforeEach(async(done) => {
    //     let prom = await UserModel.removeOne({"username" : "test_user"});
    //     console.log(prom);
    //     return done();
    // })

    it('Should receive 200 for all correct data', function(done){
        const body = {
            "username" : "test_user",
            "password" : "asdfasdf",
            "occupation" : "student",
            "email" : "testuser@gmail.com",
            "phone" : "9640763536", 
            "address" : {
                "name"		: "SLV PG",
                "street"	: "blah street",
                "city"		: "Bangalore",
                "state"		: "Karnataka",
                "country"	: "India",
                "pincode"   : 500928
            }
        };
        chai.request(base_url)
            .post('/common/register')
            .send(body)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
})