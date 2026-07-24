const Member = require("../models/Member");
const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");


const getDashboardStats = async(req,res)=>{


try{


const totalMembers =
await Member.countDocuments();



const activeMembers =
await Member.countDocuments({

    status:"Active"

});



const expiredMembers =
await Member.countDocuments({

    status:"Expired"

});


const payments =
await Payment.find({

    status:"Completed"

});



let totalRevenue = 0;



payments.forEach(payment=>{


    totalRevenue += Number(payment.amount);


});


const start =
new Date();

start.setHours(
    0,0,0,0
);



const end =
new Date();

end.setHours(
    23,59,59,999
);



const todayAttendance =
await Attendance.countDocuments({

    attendanceDate:{

        $gte:start,

        $lte:end

    }

});





const presentToday =
await Attendance.countDocuments({

    attendanceDate:{

        $gte:start,

        $lte:end

    },

    status:"Present"

});




const absentToday =
await Attendance.countDocuments({

    attendanceDate:{

        $gte:start,

        $lte:end

    },

    status:"Absent"

});






res.json({

    totalMembers,

    activeMembers,

    expiredMembers,

    totalRevenue,

    todayAttendance,

    presentToday,

    absentToday


});



}


catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}



};




const getRecentMembers = async(req,res)=>{


try{


const members =
await Member.find()

.sort({

createdAt:-1

})

.limit(5);



res.json(members);



}

catch(error){


res.status(500).json({

message:error.message

});


}



};


const getRecentPayments = async(req,res)=>{


try{


const payments =
await Payment.find()

.sort({

createdAt:-1

})

.limit(5);



res.json(payments);



}

catch(error){


res.status(500).json({

message:error.message

});


}



};


const getChartData = async(req,res)=>{


try{


const payments =
await Payment.find({

status:"Completed"

});



let revenue = {};




payments.forEach(payment=>{


const month =
new Date(payment.paymentDate)

.toLocaleString(

"en-IN",

{

month:"short"

}

);



if(!revenue[month]){


revenue[month]=0;


}



revenue[month]+=Number(payment.amount);



});





const revenueData =
Object.keys(revenue)

.map(month=>{


return {

month,

amount:revenue[month]

};


});






const present =
await Attendance.countDocuments({

status:"Present"

});



const absent =
await Attendance.countDocuments({

status:"Absent"

});






res.json({

revenue:revenueData,


attendance:{

present,

absent

}


});



}



catch(error){


res.status(500).json({

message:error.message

});


}



};









module.exports = {


getDashboardStats,

getRecentMembers,

getRecentPayments,

getChartData


};