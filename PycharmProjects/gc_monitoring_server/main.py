from fastapi import FastAPI
from collections import OrderedDict
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import datetime
import pandas as pd
from typing import Optional
from pydantic import BaseModel
from common import ConfigManager, MySQLWrapper, CommonUtil

config_manager = None
interface_process = None
logger = None
commonUtil = CommonUtil.CommonUtil()

class MonitorInfo(BaseModel):
    vendor: str
    instance_id: str
    instance_name: str
    metric: str
    value: float
    time: str
    time_key: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포시에는 특정 도메인을 명시적으로 지정해주세요.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/monitor_info") # AWS, GCP 인스턴스로부터 받은 모니터링 데이터를 데이터베이스에 저장합니다.
def post_monitor_info(monitorInfo: MonitorInfo):
    try:
        myfunc = sys._getframe().f_code.co_name
        global logger
        logger.info(f"[{myfunc}] called api. item:{monitorInfo}")
        _dict = {}
        _dict['vendor'] = str(monitorInfo.vendor)
        _dict['instance_id'] = str(monitorInfo.instance_id)
        _dict['instance_name'] = str(monitorInfo.instance_name)
        _dict['metric'] = str(monitorInfo.metric)
        _dict['value'] = str(monitorInfo.value)
        _dict['time'] = str(monitorInfo.time)
        _dict['time_key'] = str(monitorInfo.time_key)
        logger.info(f"[{myfunc}] item:{_dict}")

        mysql_wrapper = MySQLWrapper.MySQLWrapper()
        mysql_wrapper.set_logger(config_manager.get_logger())
        mysql_wrapper.db_connect(config_manager.get_db_connection_info())

        df = pd.json_normalize(_dict)
        mysql_wrapper.db_insert(df, 'monitor', "insertonly")
        mysql_wrapper.db_commit()
        mysql_wrapper.db_close()

        json_data = commonUtil.make_json_result(True, "0", "", "")
        return json_data

    except Exception as err:
        json_data = commonUtil.make_json_result(False, "99", f"{str(err)}", None)
        logger.error(f"[{myfunc}] Exception err:{str(err)}, data:{_dict}")
        mysql_wrapper.db_close()
        return json_data

@app.get("/monitor_info") #저장된 모니터링 데이터를 웹에서 조회할 수 있게 해줍니다.
def get_monitor_info(instance_id: Optional[str] = None, start_date: Optional[str] = None,
                     vendor: Optional[str] = None, metric: Optional[str] = None):
    try:
        myfunc = sys._getframe().f_code.co_name
        logger.info(f"[{myfunc}] called api.")

        mysql_wrapper = MySQLWrapper.MySQLWrapper()
        mysql_wrapper.set_logger(config_manager.get_logger())
        mysql_wrapper.db_connect(config_manager.get_db_connection_info())
        sql_text = "select * from monitor where 1=1 "
        if instance_id:
            sql_text = sql_text + f"and instance_id = '{instance_id}' "
        if start_date:
            sql_text = sql_text + f"and time > '{start_date}' "
        if vendor:
            sql_text = sql_text + f"and vendor = '{vendor}' "
        if metric:
            sql_text = sql_text + f"and metric = '{metric}' "

        monitor_info = mysql_wrapper.db_select("all", sql_text)

        _json_data = commonUtil.make_json_result(True, "0", "", monitor_info)

        logger.info(f"[{myfunc}] return data:{_json_data}")
        mysql_wrapper.db_close()
        return _json_data

    except Exception as err:
        json_data = commonUtil.make_json_result(False, "99", str(err), None)
        logger.error(f"[{myfunc}] Exception err:{err}")
        mysql_wrapper.db_close()
        return json_data


@app.on_event("startup")
def startup():

    global config_manager
    global interface_process
    global logger
    config_manager = ConfigManager.ConfigManager()
    config_file = os.getenv('SERVER_CONFIG', './config/config.xml')
    config_manager.load_config(config_file)
    logger = config_manager.get_logger()

@app.on_event("shutdown")
def shutdown():
    pass


if __name__ == '__main__':

    # os.environ.setdefault('SERVER_HOME', 'C:\\Users\\tjddu\\OneDrive - 대전대학교\\바탕 화면\\Hanium_hy-cloud - 복사본\\PycharmProjects\\gc_monitoring_server')

    try:
        server_home = os.getenv('SERVER_HOME')
        now = datetime.datetime.now()
        if server_home == None:
            print(f"{now} ENV SERVER_HOME not found")
            raise Exception

        config_file = os.getenv('SERVER_CONFIG', './config/config.xml')
        config_manager = ConfigManager.ConfigManager()
        config_manager.load_config(config_file)
        config_server = config_manager.get_server_info()
        uvicorn.run("main:app", host=config_server.ip, port=config_server.port, reload=True)

        sys.exit(0)
    except Exception as err:
        print(f"{now} process terminated with exception")
        raise SystemExit(-1)